authLogin

**Auth Login**

### Request

* **Method**: POST
* **Path**: `/auth/login`
* **Query Parameters**: `appid` (required)
* **Headers**:
	+ `device-token` (required): The device token to authenticate with.

### Response

* **Status Code**:
	+ 200: Successfully redirected to Docusign OAuth authentication page.
	+ 400: No login available for this app.
	+ 500: Missing required environment variables.

### Description

Authenticates a user and redirects them to the Docusign OAuth authorization page. The `appid` query parameter is used to determine which application to authenticate with. If the app ID matches the expected value, the API generates a code verifier and challenge, sets session variables, and stores the device token in memory. It then constructs the authentication URL using the generated values and redirects the user.

### Notes

* The `device-token` header is required for authentication.
* This endpoint only handles login requests for the specified app ID.

---

docusignLoginSuccess

**docusignLoginSuccess**

### Request

* Method: `POST`
* Query Parameters:
	+ code: Required. The authorization code.
	+ state: Required. The device token.

### Response

* Status Codes:
	+ 200: Successful login and user data retrieval.
	+ 500: Error getting access token or updating user information.

### Request Body

N/A

### Parameters

* `req`: The HTTP request object.
* `res`: The HTTP response object.
* `getDocusignUserInfoAndEnvelopesFn`: A function to retrieve the user's info and envelopes from Docusign. Defaults to `getDocusignUserInfoAndEnvelopes`.
* `createOrUpdateNotifcationFromEnvelopesFn`: A function to create or update notifications for the retrieved envelopes. Defaults to `createOrUpdateNotifcationFromEnvelopes`.
* `updateUserApplicationFn`: A function to update the user application with the retrieved user data. Defaults to `updateUserApplication`.

### Description

This API endpoint handles a successful Docusign login and retrieves the user's information, including their email address and envelopes. It then updates the user's email address and device token in the database, creates or updates notifications for any retrieved envelopes, and calls the `updateUserApplicationFn` to update the user application with the new data.

---

getDocusignUserInfoAndEnvelopes

**getDocusignUserInfoAndEnvelopes**

### Request

* **Method**: GET
* **Path**: None (calls multiple API endpoints)
* **Query Parameters**: None
* **Headers**: 
	+ `Authorization`: Bearer token with the specified access token
	+ `Content-Type`: application/json

### Response

* **Type**: Promise<{ userInfo: DocusignUserInfo; envelopes: Envelope[] }>
* **Description**: Returns user information and a list of envelopes for the authenticated user.

### Error Handling

* If the request to retrieve user information fails, an error is thrown with a message containing the `error_description` from the API response.
* If the request to retrieve envelopes fails, an error is thrown with a message containing the error message or JSON response from the API.

---

createOrUpdateNotifcationFromEnvelopes

**createOrUpdateNotifcationFromEnvelopes**

### Request

* **Method**: POST
* **Path**: `/api/notifs/create-or-update`

### Parameters

* **envelopes**: An array of `Envelope` objects.
* **userEmail**: A string representing the email address of the user.

### Response

* **Type**: `void`

### Description

Creates or updates notifications for the specified user based on the provided envelopes. If a notification does not exist, a new one is created. If an existing notification is signed and the envelope status is complete, the notification is updated to reflect the signed status.

### Errors

* **User not found**: The user with the specified email address was not found in the system.
* **Internal Server Error**: An unexpected error occurred while processing the request.

---

updateUserApplication

**API: Update User Application**

### Method
`PUT /userApplications`

### Request Body
* `user`: The updated user object (type: `User`)
* `app`: The updated application object (type: `Application`)

### Response
* Type: `void`

### Description
Updates the user application with the provided user and app information. If a matching user application does not exist, creates a new one. Otherwise, updates the existing user application.

### Parameters
* `user.id`: The ID of the updated user (type: `integer`)
* `app.id`: The ID of the updated application (type: `integer`)

### Notes

* The API may perform additional operations to retrieve and update related data.
* Error handling is not specified in this documentation.

---

flattenEnvelopes

**Flatten Envelopes API**

### Method: `flattenEnvelopes`

#### Request Body:

* `envelopesData`: An object containing an array of `EnvelopeFolder` or `Envelope` objects.

#### Response:

* A list of `Envelope` objects, with all nested folders and envelopes flattened into a single array.

### Parameters:

* `envelopesData`: Required. The input data to be processed.

### Examples:

* Request: `{ "folders": [{ "folderItems": [...], "folders": [...] }] }`
* Response: `[ ..., ... ]`

### Notes:

This API method recursively traverses an input object containing nested envelopes and folders, returning a flat array of `Envelope` objects.

---

sendNotification

**sendNotification**

* **Method:** `async`
* **Path:** N/A
* **HTTP Method:** N/A
* **Description:** Sends a notification to a device using Apple Push Notification Service (APNs) via the `apnProvider`.
* **Parameters:**
	+ `notification`: Required. A `Notification` object containing information about the notification.
	+ `deviceToken`: Required. The token of the device to receive the notification.
	+ `num_of_unsigned_notif`: Required. The number of unsigned notifications (used as the badge count in the APNs payload).
* **Returns:** None
* **Error Handling:** N/A