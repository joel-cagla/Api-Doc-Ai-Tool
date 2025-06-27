**File: proxytest.py**

**Functions**

### add_proxies_to_file

Adds one or multiple proxies to the CSV file.

**Path Parameter**: `csv_path` (str) - The path to the CSV file.

**Parameter**: `proxies` (list) - A list of proxy objects.

**Returns**: None

---

**proxytest.py**

### Functions

#### test_proxy
```
def test_proxy(proxy_type: str, proxy_address: str, iptest: str):
    '''This function takes a proxy (type, address) and tests it against a given iptest adress.'''
    ...
```
* **proxy_type**: string
* **proxy_address**: string
* **iptest**: string

Returns:

* **proxy_status**: string
* **proxy_type**: string
* **proxy_address**: string

---

**proxytest.py**

### Functions

#### `test_single_proxy`

* **Description**: This function tests an individual proxy and adds it to the CSV file.
* **Parameters**:
	+ `proxy`: The proxy URL in the format `<protocol>://<address>` (e.g., "http://example.com")
	+ `iptest`: Not specified
	+ `csv_path`: The path to the CSV file where the proxy will be added
* **Returns**: A dictionary containing the test result

### Notes

---

**proxytest.py**

### Functions

#### test_csv_file
Test every proxy in a given CSV file.

* **Parameters**
	+ iptest: str
	+ csv_path: str
* **Returns** None

Note: This function is used to (re)test every proxy in a given CSV file.

---

**proxytest.py**

### add_from_text_file

* **Summary**: Adds a list of proxies from a text file (line by line).
* **Parameters**:
	+ `iptest`: 
	+ `text_path`: Path to the text file.
	+ `csv_path`: 
* **Returns**: None
* **Description**: This function reads a text file, splits it into lines, and adds each proxy as a single proxy using an existing function.

---

**export_mysql_data_to_csv.py**

### SQL API

* `sql(sqlstr)`: Execute a SQL query and retrieve the results.
	+ Parameters:
		- `sqlstr`: The SQL query string to execute.
	+ Returns: A list of query results.

Note: This function is used internally by other APIs in this file.

---

**export_mysql_data_to_csv.py**

### CSV Export API Routes

#### `read_mysql_to_csv`

* **Method:** POST
* **Path:** `/read_mysql_to_csv`
* **Request Body:**
	+ `filename`: The name of the MySQL file to read (required)
* **Response:** A CSV file containing the exported data

Note: This API route reads a MySQL database and exports the data to a CSV file.

---

**export_mysql_data_to_csv.py**

### Symbols

#### upload_file_robots

* **Request**: POST https://qyapi.weixin.qq.com/cgi-bin/webhook/upload_media?key={key}s&type=file
	+ Parameters: key (required)
* **Body**: file=<filename> (file upload)
* **Response**:
	+ Returns a JSON response with media_id property

---

**export_mysql_data_to_csv.py**

### Symbols

#### send_file_robots(media_id)

* **Description:** Sends a file webhook request to WeChat.
* **Path:** N/A (not a REST API route)
* **HTTP Method:** POST
* **Request Body:**
	+ `media_id`: Required. The media ID for the file to be sent.
* **Response:** Returns the response from the WeChat API.

Note: This is not a traditional REST API endpoint, but rather a Python function that makes a POST request to the WeChat API.

---

**bot.py**

**Classes**

### MyBot

* `__init__`: Initializes the bot with a Wechaty instance.
* `on_ready`: Listens for the on-ready event and logs the event payload.
* `on_message`: Handles incoming messages. Supports various message types (text, image, file, mini-program).
	+ Processes specific commands (e.g., "ding", "get room members", "remove room member:", "rename room topic:", "add new friend:", "at me", "my alias", "set alias:", "find friends:").
* `on_login`: Handles the login event. Logs the logged-in contact and sets the bot's login user.
* `on_friendship`: Handles friendship events (receiving or accepting a friendship application).
	+ Processes received friendships and accepts them if they contain the keyword "wechaty".
	+ Invites new friends to Wechaty rooms with available space.

### Rooms

#### on_room_join

* Handles room join events. Welcomes new arrivals by saying something to the room.
	+ Lists the names of the new contacts.

---

**bot.py**

### Functions

#### `main`

* `async` Returns immediately, allowing other tasks to run.
* `-> None` Indicates that the function does not return any value.

Description: Starts the bot.

---

**bot.py**

**Initialization**
```
POST /bot/init

Summary: Initializes the bot.

Description: Initializes the bot, setting up internal state and configurations.

Parameters:

* None

Returns:

* None
```

---

**bot.py**

### Events

#### On Ready

* **Listen for the "on_ready" event**
* **Description:** Listen for the "on-ready" event and log the event details.
* **Endpoint:** N/A
* **Method:** N/A
* **Request Body:** N/A
* **Response:** None

---

**bot.py**

### Message Event Handlers

#### Listen for Messages

* `on_message`: Listens for message events and handles various message types.

##### Supported Message Types:

* `MESSAGE_TYPE_IMAGE`
* `MESSAGE_TYPE_AUDIO`, `MESSAGE_TYPE_ATTACHMENT`, `MESSAGE_TYPE_VIDEO`
* `MESSAGE_TYPE_MINI_PROGRAM`

##### Actions:

* Responds with a "dong" message upon receiving a 'ding' message.
* Saves images, thumbnails, and artwork to files.
* Replies with the received image file.
* Saves audio, attachment, or video files.
* Executes mini-programs.

#### Room Member Management

##### Get Room Members

* Returns room members' names upon receiving 'get room members' message in a valid room.

##### Remove Room Member

* Removes a room member by name if the user is an admin and the member exists.
* Returns an error message if the operation fails or the user is not an admin.

#### Room Topic Management

##### Get Room Topic

* Returns the current room topic upon receiving 'get room topic' message in a valid room.

##### Rename Room Topic

* Renames the room topic to the new topic received as input.
* Confirms the renamed topic in the response.

#### Friendship Management

##### Add New Friend

* Adds a new friend with the provided WeChat or phone identity information.
* Returns an error if the operation fails.

#### Mention and Alias Management

##### At Me

* Mentions the message sender in the received 'at me' message.

##### My Alias

* Returns the user's alias upon receiving 'my alias' message.

##### Set Alias

* Sets a new alias for the user upon receiving 'set alias:' message.
* Returns the new alias in the response.

#### Find Friends

* Searches and returns all friends with the given name.
* Handles multiple results by returning a list of contacts.

---

**bot.py**

### Events

#### on_login

* Description: login event
* Parameters:
	+ `contact` (Contact): the account logged in

---

**bot.py**

### Friendship API Endpoints

#### `on_friendship`

* Receive a new friendship application, or accept a new friendship
* Accepts: `Friendship` object containing status and friendship info (e.g. hello text, friend contact object)

### Symbol Documentation

#### `MAX_ROOM_MEMBER_COUNT`

* Maximum number of members allowed in a Wechaty room

Note: The above documentation only includes the API endpoints and symbols from the provided source code file (`bot.py`).

---

**bot.py**

### Room Join API

#### on_room_join

*Description:* when there are new contacts to the room

##### Parameters:

* `room`: the room instance
* `invitees`: the new contacts to the room (List[Contact])
* `inviter`: the inviter who share qrcode or manual invite someone (Contact)
* `date`: the datetime to join the room (datetime)

##### Request Body:*

None

##### Response:*

None