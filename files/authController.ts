import { Request, Response } from 'express';
import crypto from 'crypto';
import ServerDB from '../../data_source';
import { Application } from '../../entity/Application';
import { Notification } from '../../entity/Notification';
import { User } from '../../entity/User';
import { User_Application } from '../../entity/User_Application';
import userService from '../services/userService';
import notificationService from '../services/notificationService';
import userApplicationService from '../services/userApplicationService';
import { UpdateRequest } from '../models/userModel';
import { Envelope, EnvelopeFolder, EnvelopesData } from '../models/authModel';
import { hash } from '../utils/encryption';
declare module 'express-session' {
  // eslint-disable-next-line no-unused-vars
  interface SessionData {
    codeVerifier?: string;
    deviceToken?: string;
  }
}

const notificationRepository = ServerDB.getRepository(Notification);
const userAppRepository = ServerDB.getRepository(User_Application);
const userRepository = ServerDB.getRepository(User);

type DocusignUserInfo = {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  created: string;
  email: string;
  accounts: {
    account_id: string;
    is_default: boolean;
    account_name: string;
    base_uri: string;
  }[];
};

const FALSE_VALUE: number = 0;
const TRUE_VALUE: number = 1;
const COMPLETE: string = 'completed';
const SCOPE = 'signature%20impersonation';

const docusignId: number = 1;
const docusignApp: Application = {
  id: docusignId,
  app_name: 'Docusign',
};

const deviceTokenStorage: {
  [deviceToken: string]: string;
} = {};

const authLogin = async (req: Request, res: Response) => {
  const appId: number = parseInt(req.params.appId);

  const deviceToken: string = req.headers['device-token'] as string;

  if (appId === docusignId) {
    if (
      !process.env.DOCUSIGN_APP_INTEGRATION_KEY ||
      !process.env.DOCUSIGN_REDIRECT_URI
    ) {
      res.status(500).send('Missing required environment variables');
      return;
    }

    const appIntegrationKey = process.env.DOCUSIGN_APP_INTEGRATION_KEY;
    const redirectUri = process.env.DOCUSIGN_REDIRECT_URI;

    const generateCodeVerifier = (): string => {
      return crypto.randomBytes(32).toString('base64url');
    };

    const generateCodeChallenge = (codeVerifier: string): string => {
      const sha256 = crypto.createHash('sha256');
      sha256.update(codeVerifier);
      return sha256.digest('base64url');
    };

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    req.session.codeVerifier = codeVerifier;
    req.session.deviceToken = deviceToken;
    deviceTokenStorage[deviceToken] = codeVerifier;
    console.log('login', deviceToken);

    const authUrl = `https://account-d.docusign.com/oauth/auth?response_type=code&client_id=${appIntegrationKey}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(SCOPE)}&code_challenge=${encodeURIComponent(codeChallenge)}&code_challenge_method=S256&state=${deviceToken}`;
    res.redirect(authUrl);
  } else {
    res.status(400).send('No login available for this app');
  }
};

const docusignLoginSuccess = async (
  req: Request,
  res: Response,
  getDocusignUserInfoAndEnvelopesFn: typeof getDocusignUserInfoAndEnvelopes = getDocusignUserInfoAndEnvelopes,
  createOrUpdateNotifcationFromEnvelopesFn: typeof createOrUpdateNotifcationFromEnvelopes = createOrUpdateNotifcationFromEnvelopes,
  updateUserApplicationFn: typeof updateUserApplication = updateUserApplication,
) => {
  const authCode = req.query.code as string;
  // const deviceToken = req.session.deviceToken as string;
  const deviceToken = req.query.state as string;
  console.log('login success', deviceToken);

  try {
    if (!authCode) {
      throw new Error('No auth code provided');
    }
  
    if (!deviceToken) {
      throw new Error('No device token found');
    }
  
    // const codeVerifier = req.session.codeVerifier;
    const codeVerifier = deviceTokenStorage[deviceToken];
    if (!codeVerifier) {
      throw new Error('No code verifier found');
    }

    const comboAppSecretKey: string = `${process.env.DOCUSIGN_APP_INTEGRATION_KEY}:${process.env.DOCUSIGN_PKCE_KEY}`;
    const base64: string = Buffer.from(comboAppSecretKey).toString('base64');

    const body = new URLSearchParams();
    body.append('grant_type', 'authorization_code');
    body.append('code', authCode);
    body.append('code_verifier', codeVerifier);

    let response = await fetch('https://account-d.docusign.com/oauth/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${base64}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.json();
      res
        .status(response.status)
        .send(`Error getting access token: ${error.error_description}`);
      return;
    }

    const { access_token: accessToken } = await response.json();

    const { userInfo, envelopes } =
      await getDocusignUserInfoAndEnvelopesFn(accessToken);
    const userEmail = hash(userInfo.email);
    const userEnvelopes = envelopes;

    const user = await userService.findUserByDeviceToken(
      userRepository,
      deviceToken,
    );

    if (!user) {
      res.status(500).send('Error getting access token: User not found');
      return;
      // throw new Error('User not found');
    }

    const foundUserByEmail = await userService.findUserByEmail(
      userRepository,
      userEmail,
    );

    const updateRequest: UpdateRequest = {
      id: foundUserByEmail ? foundUserByEmail.id : user.id,
      email: userEmail,
      deviceToken: deviceToken,
    };
    user.email = userEmail;
    if (foundUserByEmail) user.id = foundUserByEmail.id;
    await userService.update(userRepository, updateRequest);

    if (userEnvelopes.length > 0) {
      await createOrUpdateNotifcationFromEnvelopesFn(userEnvelopes, userEmail);
    }

    await updateUserApplicationFn(user, docusignApp);

    // delete deviceTokenStorage[deviceToken];
    res.send({
      user,
      message: 'ログインに成功しました。',
    });
  } catch (error) {
    res
      .status(500)
      .send(`Error getting access token: ${(error as Error).message}`);
  }
};

const getDocusignUserInfoAndEnvelopes = async (
  accessToken: string
): Promise<{ userInfo: DocusignUserInfo; envelopes: Envelope[] }> => {
  const userInfoResponse = await fetch(
    'https://account-d.docusign.com/oauth/userinfo',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!userInfoResponse.ok) {
    const errorResponse = await userInfoResponse.json();
    throw new Error(`Error getting user info: ${errorResponse.error_description}`);
  }

  const userInfo: DocusignUserInfo = await userInfoResponse.json();
  const accountId = userInfo.accounts[0]?.account_id;
  if (!accountId) {
    throw new Error('No account found for the user');
  }

  const envelopesResponse = await fetch(
    `https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/folders/inbox?from_date=2025-01-01&include_items=true`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!envelopesResponse.ok) {
    const errorResponse = await envelopesResponse.json();
    console.error('DocuSign API Error:', errorResponse);
    throw new Error(
      `Error fetching envelopes: ${errorResponse.message || JSON.stringify(errorResponse)}`,
    );
  }

  const envelopesData: EnvelopesData = await envelopesResponse.json();
  const allEnvelopes = flattenEnvelopes(envelopesData);
  return { userInfo, envelopes: allEnvelopes };
};

const createOrUpdateNotifcationFromEnvelopes = async (
  envelopes: Envelope[],
  userEmail: string
): Promise<void> => {
  const user = await userService.findUserByEmail(userRepository, userEmail);
  if (!user) {
    throw new Error('User not found');
  }

  const userId = user.id;
  const userNotifications = await notificationService.findNotificationsByUserIdAndAppId(
    notificationRepository,
    userId,
    docusignId,
  );

  for (const envelope of envelopes) {
    const envelopeId = envelope.envelopeId;
    const foundNotification = userNotifications.find(
      (notification) => notification.envelope_id === envelopeId,
    );

    if (!foundNotification) {
      const splitSubject = envelope.subject.split(': ');
      const sender = envelope.senderName || envelope.senderEmail;
      const newNotification = new Notification(
        splitSubject.length > 1 ? splitSubject[1] : envelope.subject,
        envelope.createdDateTime,
        0,
        envelope.status === 'completed' ? TRUE_VALUE : FALSE_VALUE,
        sender,
        user,
        docusignApp,
        envelopeId,
      );
      await notificationService.create(notificationRepository, newNotification);
    } else if (
      foundNotification.is_signed === FALSE_VALUE &&
      envelope.status === COMPLETE
    ) {
      foundNotification.is_signed = TRUE_VALUE;
      await notificationService.update(notificationRepository, foundNotification);
    }
  }
};

const updateUserApplication = async (
  user: User,
  app: Application,
): Promise<void> => {
  const userId = user.id;
  const appId = app.id;

  const unsignedNotificationCount =
    await notificationService.getUnsignedNotificationCount(
      notificationRepository,
      userId,
      appId,
    );
  const userApplication = await userApplicationService.findOneByUserIdAndAppId(
    userAppRepository,
    userId,
    appId,
  );

  if (!userApplication) {
    const newUserApp = new User_Application(
      app,
      user,
      unsignedNotificationCount,
      1,
    );
    await userApplicationService.create(userAppRepository, newUserApp);
  } else {
    const userApp = userApplication;
    userApp.num_of_unsigned_notif = unsignedNotificationCount;
    userApp.is_logged_in = 1;
    await userApplicationService.update(userAppRepository, userApp);
  }
};

const flattenEnvelopes = (envelopesData: EnvelopesData): Envelope[] => {
  const flattened: Envelope[] = [];

  const processFolder = (folder: EnvelopeFolder | Envelope[]) => {
    if (Array.isArray(folder)) {
      flattened.push(...folder);
    } else {
      if (folder.folderItems && Array.isArray(folder.folderItems)) {
        flattened.push(...folder.folderItems);
      }
      if (folder.folders && Array.isArray(folder.folders)) {
        folder.folders.forEach(processFolder);
      }
    }
  };

  if (envelopesData.folders && Array.isArray(envelopesData.folders)) {
    envelopesData.folders.forEach(processFolder);
  }

  return flattened;
};

export default {
  authLogin,
  docusignLoginSuccess,
};
