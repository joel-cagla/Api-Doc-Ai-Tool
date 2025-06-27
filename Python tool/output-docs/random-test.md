**File: proxytest.py**

### Functions

#### add_proxies_to_file(csv_path: str, proxies: list)

* Adds one or multiple proxies to the CSV file.
* If the CSV file does not exist, a new one will be created. Otherwise, an existing file will be loaded.
* Each proxy is checked for uniqueness based on 'proxy_type' and 'proxy_address'. If the proxy already exists in the file, its status will be updated.

#### test_proxy(proxy_type: str, proxy_address: str, iptest: str)

* Tests a given proxy (type, address) against a given iptest address.
* Makes a GET request to either http or https depending on the proxy type, with the proxy set.
* The response is checked for validity and functionality. If the response is invalid, an error message will be returned.

---

**Proxytest.py**

### Symbols

#### Functions

* **test_single_proxy**
	+ Tests an individual proxy and adds it to the CSV file.
	+ Parameters:
		- `proxy`: str
		- `iptest`: str
		- `csv_path`: str
	+ Returns: None
* **test_csv_file**
	+ (Re)tests every proxy in a given CSV file.
	+ Parameters:
		- `iptest`: str
		- `csv_path`: str
	+ Returns: None

---

**proxytest.py**

### Add Proxies from Text File

#### Path: `/add-proxies-from-text-file`

* **Method:** `POST`
* **Request Body:** JSON object with the following properties:
	+ `iptest`: String
	+ `text_path`: String
	+ `csv_path`: String
* **Response:** None

**export_mysql_data_to_csv.py**

### Execute SQL Query

#### Path: `/execute-sql`

* **Method:** `POST`
* **Request Body:** JSON object with the following property:
	+ `sqlstr`: String (SQL query string)
* **Response:** JSON array of results

Note: These API documentation are based on the provided source code.

---

**export_mysql_data_to_csv.py**

### read_mysql_to_csv

* **Method:** `read_mysql_to_csv`
* **Description:** Reads data from MySQL and writes it to a CSV file.
* **Parameters:**
	+ `filename`: The name of the CSV file to write.
* **Returns:** None

### upload_file_robots

* **Method:** `upload_file_robots`
* **Description:** Uploads a file to WeChat robots using the WeCom API.
* **Parameters:**
	+ `filename`: The name of the file to upload.
* **Returns:** The media ID of the uploaded file.

Note: This documentation only covers the provided source code and does not include any additional information.

---

**File: export_mysql_data_to_csv.py**

### Send File Robots API

* **Method:** `POST`
* **Path:** `/send_file_robots/{media_id}`
* **Description:** Sends a file robot request to WeChat.
* **Parameters:**
	+ `media_id`: The ID of the media file to send.
* **Returns:** A response indicating whether the request was successful.

**File: bot.py**

### MyBot API

#### Initialize API

* **Method:** `POST`
* **Path:** `/init`
* **Description:** Initializes the WeChaty bot.
* **Parameters:** None
* **Returns:** A response indicating whether the initialization was successful.

#### On Ready API

* **Method:** `GET`
* **Path:** `/on_ready`
* **Description:** Triggers an event when the bot is ready.
* **Parameters:** None
* **Returns:** A response indicating whether the event was triggered successfully.

#### On Message API

* **Method:** `POST`
* **Path:** `/on_message`
* **Description:** Processes a WeChat message and responds accordingly.
* **Parameters:**
	+ `text`: The text content of the message.
	+ `room`: The room ID where the message was sent (optional).
* **Returns:** A response indicating whether the message was processed successfully.

#### On Login API

* **Method:** `GET`
* **Path:** `/on_login/{contact_id}`
* **Description:** Triggers an event when a user logs in.
* **Parameters:**
	+ `contact_id`: The ID of the logged-in contact.
* **Returns:** A response indicating whether the login was successful.

#### On Friendship API

* **Method:** `GET`
* **Path:** `/on_friendship/{friendship_type}`
* **Description:** Processes a WeChat friendship request or update.
* **Parameters:**
	+ `friendship_type`: The type of friendship (receive, confirm, etc.).
* **Returns:** A response indicating whether the friendship was processed successfully.

#### On Room Join API

* **Method:** `GET`
* **Path:** `/on_room_join/{room_id}/{invitees}/{inviter}/{date}`
* **Description:** Triggers an event when a user joins a room.
* **Parameters:**
	+ `room_id`: The ID of the joined room.
	+ `invitees`: A list of contacts who joined the room.
	+ `inviter`: The contact who invited others to join the room.
	+ `date`: The date and time when the user joined the room.
* **Returns:** A response indicating whether the event was triggered successfully.

---

**bot.py**

### Functions

#### main

* `async def main() -> None`
	+ Description: Initializes the bot.
	+ Returns: None

### Classes

#### MyBot

* `__init__(self) -> None`
	+ Description: Initialization function.
	+ Parameters: self
	+ Returns: None

---

**bot.py**

### Events

* **on_ready**
    * Listen for the on-ready event
	+ Payload: `EventReadyPayload`
	+ Return type: `None`

* **on_message**
    * Listen for message events
	+ Message: `Message`
	+ Return type: `None`

#### on_message (message) Parameters:

* `msg`: The received message

#### on_message (message) Behavior:

* Handles various message types:
	+ `MessageType.MESSAGE_TYPE_IMAGE`: Downloads and saves the image
	+ `MessageType.MESSAGE_TYPE_AUDIO`, `MessageType.MESSAGE_TYPE_ATTACHMENT`, `MessageType.MESSAGE_TYPE_VIDEO`: Saves the file to a local directory
	+ `MessageType.MESSAGE_TYPE_MINI_PROGRAM`: Sends the mini-program back as a response
* Handles specific commands:
	+ `'ding'`: Sends a "dong" message and an image file
	+ `'get room members'`: Retrieves the list of room members and sends it back
	+ `'remove room member:<room_member_name>'`: Removes the specified room member (if the bot is an admin)
	+ `'get room topic'`: Retrieves the room topic and sends it back
	+ `'rename room topic:<new_topic>'`: Renames the room topic to the specified value
	+ `'add new friend:<identity_info>'`: Adds a new friendship (WeChat or phone-based) with the specified identity information
	+ `'at me'`: Sends a "hello" message mentioning the sender's alias
	+ `'my alias'`: Retrieves and sends back the sender's alias
	+ `'set alias:<new_alias>'`: Sets and retrieves the sender's new alias

---

**bot.py**

### Symbols

#### Events

##### on_login
```json
POST /login
```
Login event.

* **Request Body**: `contact` (Contact) - the account logined
* **Response**: None

##### on_friendship
```json
POST /friendship
```
When receive a new friendship application, or accept a new friendship.

* **Request Body**: `friendship` (Friendship) - contains the status and friendship info,
  eg: hello text, friend contact object
* **Response**: None

### Actions

#### on_friendship
```json
POST /friendship/accept
```
Accept a new friendship when there is a keyword in hello text.

* **Request Body**: `friendship` (Friendship) - the friendship to accept
* **Response**: None

---

**bot.py**

### on_room_join

#### Description

on_room_join when there are new contacts to the room

### Parameters

* **room**: `Room` - the room instance
* **invitees**: `List[Contact]` - the new contacts to the room
* **inviter**: `Contact` - the inviter who share qrcode or manual invite someone
* **date**: `datetime` - the datetime to join the room

### Returns

* `None`