import apn from 'apn';
import { Notification } from '../../entity/Notification';

const keyPath = process.env.APN_KEY ?? '';
const keyId = process.env.APN_KEY_ID ?? '';
const teamId = process.env.APN_TEAM_ID ?? '';
const bundleId = process.env.APN_BUNDLE_ID ?? '';

const options = {
  token: { key: keyPath, keyId: keyId, teamId: teamId },
  production: process.env.NODE_ENV === 'production',
};

if (!options.token.key || !options.token.keyId || !options.token.teamId) {
  throw new Error('One or more APN token fields are missing.');
}

const apnProvider = new apn.Provider(options);

const sendNotification = async (
  notification: Notification,
  deviceToken: string,
  num_of_unsigned_notif: number,
) => {


  if (notification && apnProvider) {
    const notif = new apn.Notification({
      alert: `${notification.sender}さんから${notification.subject}の承認依頼が届きました。`,
      body: `${notification.sender}さんから${notification.subject}の承認依頼が届きました。`,
      date: notification.date,
      topic: bundleId,
      badge: num_of_unsigned_notif,
      payload: {
        from: 'approveHub, using node-apn',
        source: 'approveHub server',
      },
    });

    await apnProvider.send(notif, deviceToken);
  }
};

export default { sendNotification };
