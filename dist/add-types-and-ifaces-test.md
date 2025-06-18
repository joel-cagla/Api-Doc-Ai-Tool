

**Functions**

### authLogin

* **Summary**: Authenticate a user and redirect them to the DocuSign authorization URL.
* **Path**: `/auth/login/{appId}`
* **Method**: `GET`
* **Request Body**: None
* **Response**: Redirect to the DocuSign authorization URL with the code verifier, device token, and scope.

### docusignLoginSuccess

* **Summary**: Handle a successful login from DocuSign and update the user's information.
* **Path**: `/auth/login/success`
* **Method**: `GET`
* **Request Body**: None
* **Response**:
	+ User object with updated email and device token.
	+ Notification messages for each envelope.

### getDocusignUserInfoAndEnvelopes

* **Summary**: Retrieve the user's information and envelopes from DocuSign using an access token.
* **Path**: `/auth/get/userinfo`
* **Method**: `GET`
* **Request Body**: None
* **Response**:
	+ User information object (DocusignUserInfo).
	+ Array of envelope objects (Envelopes).

### createOrUpdateNotifcationFromEnvelopes

* **Summary**: Create or update notifications for each envelope in the array.
* **Path**: `/auth/notifications`
* **Method**: `POST`
* **Request Body**: Envelope array
* **Response**: None

---



**Functions**

### updateUserApplication

`POST /update-user-application`

Updates the user's application information. If the user does not have an existing application, a new one is created.

* **Path Parameters:** None
* **Request Body:**
	+ `user`: The user object (required)
	+ `app`: The application object (required)
* **Response:** `void`

### flattenEnvelopes

`GET /flatten-envelopes`

Flattens an array of envelopes and their folders into a single array of envelopes.

* **Path Parameters:** None
* **Request Body:** `envelopesData: EnvelopesData` (required)
* **Response:** `Envelope[]`

### create

`POST /create`

Creates a new user with the provided email and device token. If an existing user is found with the same device token, it returns an error.

* **Path Parameters:** None
* **Request Body:**
	+ `email`: The user's email (optional)
	+ `deviceToken`: The user's device token (required)
* **Response:** `User` or error

### update

`POST /update/:userId`

Updates the specified user's information.

* **Path Parameters:**
	+ `userId`: The ID of the user to update (required)
* **Request Body:**
	+ `deviceToken`: The user's device token (optional)
	+ `email`: The user's email (optional)
* **Response:** `User` or error

---



**Functions**

### sendNotification

Send a notification to a device using Apple Push Notification service (APNs).

* **Parameters**
	+ `notification`: The notification object.
	+ `deviceToken`: The device token to send the notification to.
	+ `num_of_unsigned_notif`: The number of unsigned notifications.
* **Returns**: None
* **Throws**: If the notification or APN provider is not available, an error is thrown.

### create

Create a new notification and return it in JSON format.

* **Parameters**
	+ `req`: The HTTP request object.
	+ `res`: The HTTP response object.
* **Returns**: A JSON-formatted notification object.
* **Throws**: If an error occurs while creating the notification, a 500 status code is returned with an error message.

### findAllByUserIdAndAppId

Retrieve all notifications for a user and app ID.

* **Parameters**
	+ `req`: The HTTP request object.
	+ `res`: The HTTP response object.
* **Returns**: A JSON-formatted array of notification objects.
* **Throws**: If an error occurs while retrieving the notifications, a 500 status code is returned with an error message.

### findByUserIdAndEnvelopeId

Retrieve a notification for a user and envelope ID.

* **Parameters**
	+ `req`: The HTTP request object.
	+ `res`: The HTTP response object.
* **Returns**: A JSON-formatted notification object.
* **Throws**: If an error occurs while retrieving the notification, a 500 status code is returned with an error message.

---



**Functions**

### getUnsignedNotificationCount

* Returns the count of unsigned notifications for a given user and application.
* Request method: GET
* Request body:
	+ `userId`: The ID of the user (required)
	+ `appId`: The ID of the application (required)
* Response:
	+ JSON object with the count of unsigned notifications
* Status codes:
	+ 200 OK
	+ 400 Bad request (if `userId` or `appId` is missing)
	+ 500 Internal Server Error

### update

* Updates a notification as read and/or signed.
* Request method: PATCH
* Request body:
	+ `id`: The ID of the notification (required)
	+ `isRead`: Whether the notification should be marked as read (optional)
	+ `isSigned`: Whether the notification should be marked as signed (optional)
* Response:
	+ JSON object with the updated notification
* Status codes:
	+ 200 OK
	+ 400 Bad request (if `id` or `isRead`/`isSigned` is missing)
	+ 404 Not Found (if the notification is not found)
	+ 500 Internal Server Error

### create

* Creates a new user application.
* Request method: POST
* Request body:
	+ `appId`: The ID of the application (required)
	+ `userId`: The ID of the user (required)
	+ `numOfUnsignedNotif`: The number of unsigned notifications (required)
	+ `isLoggedIn`: Whether the user is logged in (required)
* Response:
	+ JSON object with the created user application
* Status codes:
	+ 201 Created
	+ 400 Bad request (if any required field is missing)
	+ 404 Not Found (if the user or application is not found)
	+ 500 Internal Server Error

### findByUserId

* Retrieves a list of user applications for a given user ID.
* Request method: GET
* Request parameter:
	+ `userId`: The ID of the user (required)
* Response:
	+ JSON array with the user applications
* Status codes:
	+ 200 OK
	+ 500 Internal Server Error

---



**Functions**

### findByEmailAndAppId

* **Method**: GET
* **Path**: /findByEmailAndAppId
* **Request Body**: `email` and `appId` required
* **Response**: User application data in JSON format
* **Error Handling**: 400 (Bad Request) if `email` or `appId` is missing, 500 (Internal Server Error) on any other error

### findByUserIdAndAppId

* **Method**: GET
* **Path**: /findByUserIdAndAppId
* **Request Body**: `userId` and `appId` required
* **Response**: User application data in JSON format
* **Error Handling**: 400 (Bad Request) if `userId` or `appId` is missing, 500 (Internal Server Error) on any other error

### update

* **Method**: PATCH
* **Path**: /update/:id
* **Request Body**: `numOfUnsignedNotif` and `isLoggedIn` required
* **Response**: Updated user application data in JSON format
* **Error Handling**: 400 (Bad Request) if `id` is missing or no updates provided, 404 (Not Found) if user application not found, 500 (Internal Server Error) on any other error

### deleteById

* **Method**: DELETE
* **Path**: /deleteById/:id
* **Request Body**: None
* **Response**: "User application deleted"
* **Error Handling**: 500 (Internal Server Error) on any other error

---



**API Endpoints**

### GET /users

Returns a list of all users.

#### Request Headers:

* None

#### Response:

* A JSON array of user objects

### GET /users/:id

Returns the user with the specified ID.

#### Request Parameters:

* `id`: The ID of the user to retrieve (integer)

#### Response:

* A JSON object representing the requested user
* 404: User not found
* 500: Error getting user

### POST /users/device-token

Returns the user associated with the specified device token.

#### Request Body:

* `deviceToken`: The device token of the user to retrieve (string)

#### Response:

* A JSON object representing the requested user
* 404: User not found
* 500: Error getting user

### POST /users/email

Returns the user associated with the specified email address.

#### Request Body:

* `email`: The email address of the user to retrieve (string)

#### Response:

* A JSON object representing the requested user
* 404: User not found
* 500: Error getting user

---



**Functions**

### update
Update a user's information.

* Method: `POST`
* Path: `/update/:id`
* Request Body:
	+ `id`: The ID of the user to update.
	+ `updateInfo`: The updated user information (see [UpdateRequest](#updaterequest)).
* Response:
	+ 200 OK: User updated successfully.
	+ 404 Not Found: User not found.
	+ 500 Internal Server Error: Error updating user.

### deleteById
Delete a user by ID.

* Method: `DELETE`
* Path: `/delete/:id`
* Request Body: None.
* Response:
	+ 200 OK: User deleted successfully.
	+ 500 Internal Server Error: Error deleting user.

### docusignNotification
Process a Docusign notification.

* Method: `POST`
* Path: `/docusign-notification`
* Request Body:
	+ `payload`: The payload from the Docusign webhook.
	+ `verify`: The verify token from the Docusign webhook.
	+ `secret`: The secret key for verifying the HMAC signature.
* Response:
	+ 200 OK: Success.
	+ 500 Internal Server Error: Error processing JSON from webhook.

**Types**

### UpdateRequest
The updated user information to update a user's profile.

* Properties:
	+ (none)

### DocusignUserInfo
Information about a Docusign user.

* Properties:
	+ `sub`: The subject identifier of the user.
	+ `name`: The full name of the user.
	+ `given_name`: The given name of the user.
	+ `family_name`: The family name of the user.
	+ `created`: The creation date and time of the user.
	+ `email`: The email address of the user.
	+ `accounts`: An array of account information for the user.

Note: This documentation only includes the provided functions, types, and interfaces. Any additional functionality or complexity is not represented here.

---



**Types**

### DocusignUserInfo

* `sub`: Unique identifier
* `name`: Full name
* `given_name`: First name
* `family_name`: Last name
* `created`: Date of creation
* `email`: Email address
* `accounts`: Array of account information, containing:
	+ `account_id`: Unique identifier
	+ `is_default`: Boolean indicating whether the account is default
	+ `account_name`: Name of the account
	+ `base_uri`: Base URI of the account

**Interfaces**

### Envelope

* `envelopeId`: Unique identifier for the envelope
* `subject`: Subject line of the envelope
* `createdDateTime`: Date and time the envelope was created
* `status`: Current status of the envelope (e.g. "sent", "delivered", etc.)
* `senderName`?: Optional sender name
* `senderEmail`: Email address of the sender

### EnvelopeFolder

* `folderItems`?: Array of envelopes contained within this folder
* `folders`?: Array of sub-folders or envelopes contained within this folder, recursively nested

---



**Interfaces**

### CreateRequest

Create a new request with the following properties:

* `subject`: The subject of the request (string)
* `date`: The date of the request (string)
* `isRead`: The read status of the request (number, 0 or 1)
* `isSigned`: The signed status of the request (number, 0 or 1)
* `sender`: The sender of the request (string)
* `receiver`: The receiver ID of the request (number)
* `appId`: The application ID associated with the request (number)
* `envelopeId`: The envelope ID associated with the request (string)

### UpdateRequest

Update an existing request with the following properties:

* `id`: The ID of the request to update (number)
* `isRead`: The read status of the request (number, 0 or 1) [optional]
* `isSigned`: The signed status of the request (number, 0 or 1) [optional]

### CreateRequest (second definition)

Create a new request with the following properties:

* `appId`: The application ID associated with the request (Application)
* `userId`: The user ID associated with the request (User)
* `numOfUnsignedNotif`: The number of unsigned notifications (number)
* `isLoggedIn`: A flag indicating whether the user is logged in (number, 0 or 1)

### UpdateRequest (second definition)

Update an existing request with the following properties:

* `id`: The ID of the request to update (number)
* `numOfUnsignedNotif`: The number of unsigned notifications [optional] (number)
* `isLoggedIn`: A flag indicating whether the user is logged in [optional] (number, 0 or 1)

---



**Interfaces**

### CreateRequest

* `email`: Optional string or null, representing the user's email address.
* `deviceToken`: Required string, representing the user's device token.

### UpdateRequest

* `id`: Required number, representing the ID of the entity being updated.
* `email`: Optional string or null, representing the user's email address (if different from original).
* `deviceToken`: Required string, representing the user's updated device token.