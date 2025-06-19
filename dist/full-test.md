

**API Documentation**

### Functions

#### create

Create a new user.

* **Method**: POST
* **URL**: /
* **Request Body**:
	+ `email`: string
	+ `deviceToken`: string
* **Response**:
	+ 200: The created user
	+ 400: Missing device token
	+ 500: Error creating user

#### update

Update a user's information.

* **Method**: PATCH
* **URL**: /users/:userId
* **Request Body**:
	+ `deviceToken`: string (optional)
	+ `email`: string (optional)
* **Response**:
	+ 200: The updated user
	+ 404: User not found
	+ 500: Error updating user device token

#### create

Create a new notification.

* **Method**: POST
* **URL**: /notifications
* **Request Body**: The notification data
* **Response**:
	+ 201: The created notification
	+ 500: Error creating notification

#### findAllByUserIdAndAppId

Get all notifications for a user and app.

* **Method**: GET
* **URL**: /notifications/users/:userId/apps/:appId
* **Request Body**:
	+ `userId`: number
	+ `appId`: number
* **Response**:
	+ 200: The list of notifications
	+ 400: Missing required fields
	+ 500: Error getting notifications

---



**API Documentation**

### Functions

#### findByUserIdAndEnvelopeId

* **Method:** GET
* **Path:** /
* **Request Body:** `{ userId: number, envelopeId: string }`
* **Response:** The notification associated with the provided user ID and envelope ID, or an error message if not found.
* **Error Handling:**
	+ 400: Missing required fields (e.g. `userId` or `envelopeId`)
	+ 500: Error getting notification

#### getUnsignedNotificationCount

* **Method:** GET
* **Path:** /
* **Request Body:** `{ userId: number, appId: number }`
* **Response:** The count of unsigned notifications for the provided user ID and app ID.
* **Error Handling:**
	+ 400: Missing required fields (e.g. `userId` or `appId`)
	+ 500: Error getting notification count

#### update

* **Method:** PUT
* **Path:** /:id
* **Request Body:** `{ id: number, isRead: boolean, isSigned: boolean }`
* **Response:** The updated notification with the provided ID, or an error message if not found.
* **Error Handling:**
	+ 400: Missing required fields (e.g. `id`, `isRead`, or `isSigned`)
	+ 404: Notification not found
	+ 500: Error updating notification

#### create

* **Method:** POST
* **Path:** /
* **Request Body:** `{ appId: number, userId: number, numOfUnsignedNotif: number, isLoggedIn: boolean }`
* **Response:** The newly created user application, or an error message if not created.
* **Error Handling:**
	+ 400: Missing required fields (e.g. `appId`, `userId`, `numOfUnsignedNotif`, or `isLoggedIn`)
	+ 404: User or application not found
	+ 500: Error creating user application

---



**Routes**

### User Applications

* `GET /users/{userId}`: Retrieves a list of user applications for the specified `userId`.
	+ Request Body: None
	+ Response: A JSON array of user applications.
* `GET /applications/email/{email}/appId/{appId}`: Retrieves a user application by email and app ID.
	+ Request Body: A JSON object with `email` and `appId` properties.
	+ Response: A JSON object representing the user application.
* `GET /users/{userId}/apps/{appId}`: Retrieves a user application by user ID and app ID.
	+ Request Body: A JSON object with `userId` and `appId` properties.
	+ Response: A JSON object representing the user application.
* `PUT /applications/{id}`: Updates an existing user application.
	+ Request Body: A JSON object with `numOfUnsignedNotif` and `isLoggedIn` properties.
	+ Response: The updated user application as a JSON object.

**Types**

None

**Interfaces**

None

---



**API Endpoints**

### Delete User Application

* `DELETE /user-applications/:id`
* Deletes a user application by ID
* Request Parameters:
	+ `id`: The ID of the user application to delete (integer)
* Response:
	+ `200 OK`: User application deleted
	+ `500 Internal Server Error`: Error deleting user application

### Find All Users

* `GET /users`
* Retrieves a list of all users
* Request Parameters: None
* Response:
	+ `200 OK`: A list of user objects in JSON format
	+ `500 Internal Server Error`: Error retrieving users

### Find User by ID

* `GET /users/:id`
* Retrieves a single user by ID
* Request Parameters:
	+ `id`: The ID of the user to retrieve (integer)
* Response:
	+ `200 OK`: A user object in JSON format
	+ `404 Not Found`: User not found
	+ `500 Internal Server Error`: Error retrieving user

### Find User by Device Token

* `GET /users/device-token`
* Retrieves a single user by device token
* Request Body:
	+ `deviceToken`: The device token of the user to retrieve (string)
* Response:
	+ `200 OK`: A user object in JSON format
	+ `404 Not Found`: User not found
	+ `500 Internal Server Error`: Error retrieving user

---



**Types**

* **Request**: The request object used in the API endpoints.
* **Response**: The response object used in the API endpoints.

**Interfaces**

None provided.

**Functions**

### `findOneByEmail`

* **Method**: GET
* **Path**: /users/email
* **Description**: Retrieves a user by email address.
* **Parameters**:
	+ `email`: The email address of the user to retrieve.
* **Response**:
	+ 200: A JSON object representing the user.
	+ 404: The user not found.

### `update`

* **Method**: PUT
* **Path**: /users/:id
* **Description**: Updates a user by ID.
* **Parameters**:
	+ `id`: The ID of the user to update.
	+ `updateInfo`: The updated information for the user.
* **Response**:
	+ 200: User updated successfully.
	+ 404: The user not found.

### `deleteById`

* **Method**: DELETE
* **Path**: /users/:id
* **Description**: Deletes a user by ID.
* **Parameters**:
	+ `id`: The ID of the user to delete.
* **Response**:
	+ 200: User deleted successfully.
	+ 500: Error deleting user.

### `docusignNotification`

* **Method**: POST
* **Path**: /webhook
* **Description**: Processes a DocuSign notification.
* **Parameters**:
	+ `payload`: The payload of the notification.
	+ `verify`: The verification token from DocuSign.
* **Response**:
	+ 200: Success.
	+ 500: Error processing JSON from webhook.

---



**Types**

### DocusignUserInfo

A type representing user information from DocuSign.

* `sub`: A unique identifier for the user.
* `name`: The full name of the user.
* `given_name`: The given name of the user.
* `family_name`: The family name (also known as last name) of the user.
* `created`: The date and time when the user was created.
* `email`: The email address of the user.
* `accounts`: An array of account information, including:
	+ `account_id`: A unique identifier for the account.
	+ `is_default`: A boolean indicating whether the account is the default one.
	+ `account_name`: The name of the account.
	+ `base_uri`: The base URI for the account.

### Envelope

A type representing an envelope in DocuSign.

* `envelopeId`: A unique identifier for the envelope.
* `subject`: The subject of the envelope.
* `createdDateTime`: The date and time when the envelope was created.
* `status`: The status of the envelope (e.g. "sent", "signed", etc.).
* `senderName?`: An optional property containing the name of the sender.
* `senderEmail`: The email address of the sender.

### EnvelopeFolder

A type representing a folder in DocuSign that contains envelopes.

* `folderItems?`: An optional array of envelope objects (Envelope[]).
* `folders?`: An optional nested array of folders or envelope arrays ((EnvelopeFolder | Envelope[])[]).

### EnvelopesData

A type representing data related to multiple envelopes in DocuSign.

* `folders?`: An optional nested array of folders or envelope arrays ((EnvelopeFolder | Envelope[])[]).

---



**Interfaces**

### CreateRequest

* `subject`: string
* `date`: string
* `isRead`: number
* `isSigned`: number
* `sender`: string
* `receiver`: number
* `appId`: number
* `envelopeId`: string

### UpdateRequest

* `id`: number
* `isRead?`: number (optional)
* `isSigned?`: number (optional)

### Application

(no documentation provided for this interface)

### User

(no documentation provided for this interface)

---



**Interfaces**

### CreateRequest

* `email`: Optional string or null
* `deviceToken`: Required string

### UpdateRequest

* `id`: Required number
* `email`: Optional string or null
* `deviceToken`: Required string

---



**Functions**

* `deviceController.create`: Creates a new device. (No documentation provided for this function)
* `deviceController.update`: Updates an existing device by user ID.

**Types**

* None provided.

**Interfaces**

* None provided.

**Routes**

* POST `/create`: Creates a new device.
	+ Request Body: N/A
	+ Response: N/A
* PUT `/update/:userId`: Updates an existing device by user ID.
	+ Path Parameters:
		- `userId`: The ID of the user to update.