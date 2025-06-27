**proxytest.py**

### Symbols

#### Functions

##### add_proxies_to_file
Adds one or multiple proxies to the CSV file.

* `csv_path`: The path to the CSV file.
* `proxies`: A list of proxies to be added.

Returns: None

##### test_proxy
Tests a proxy against a given iptest address.

* `proxy_type`: The type of the proxy (https/http).
* `proxy_address`: The address of the proxy.
* `iptest`: The address to test the proxy with.

Returns: A dictionary containing the proxy's status.

##### test_single_proxy
Tests an individual proxy and adds it to the CSV file.

* `proxy`: The proxy to be tested, in the format "protocol://address".
* `iptest`: The address to test the proxy with.
* `csv_path`: The path to the CSV file where the proxy will be added.

Returns: None

##### test_csv_file
Tests every proxy in a given CSV file.

* `iptest`: The address to test each proxy with.
* `csv_path`: The path to the CSV file containing the proxies to be tested.

Returns: None

---

**proxytest.py**

### Proxies

#### Add Proxies from Text File

* `add_from_text_file(iptest: str, text_path: str, csv_path: str)`: Adds a list of proxies from a text file (line by line).
	+ Parameters:
		- `iptest`: The input test string.
		- `text_path`: The path to the text file.
		- `csv_path`: The path to the CSV file.
	+ Returns: None.

---

**File: export_mysql_data_to_csv.py**

### Send File Robots

* **Method**: `send_file_robots`
* **Parameter**: `media_id` (required)
* **Description**: Sends a file to WeChat using the Webhook API.
* **Request Body**: JSON payload containing the file media ID.
* **Response**: The response from the WeChat API.

**Example Request**:

```bash
POST https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=<KEY>
{
  "msgtype": "file",
  "file": {
    "media_id": "<MEDIA_ID>"
  }
}
```

**File: bot.py**

### MyBot Class

* **Methods**:
	+ `__init__`: Initialization function.
	+ `on_ready`: Listens for the on-ready event.
	+ `on_message`: Handles message events.
	+ `on_login`: Handles login events.
	+ `on_friendship`: Handles friendship events.
	+ `on_room_join`: Handles room join events.

### on_message Method

* **Parameter**: `msg` (required)
* **Description**: Handles message events.
* **Supported Message Types**:
	+ Text
	+ Image
	+ Audio
	+ Attachment
	+ Video
	+ Mini-program
* **Actions**:
	+ Replies to the message with a file box if the message contains "ding".
	+ Downloads and saves image files.
	+ Replies to the message with an image file.
	+ Adds new friends.
	+ Sets or gets aliases.

### on_login Method

* **Parameter**: `contact` (required)
* **Description**: Handles login events.
* **Actions**:
	+ Logs in as the specified contact.

### on_friendship Method

* **Parameter**: `friendship` (required)
* **Description**: Handles friendship events.
* **Supported Friendship Types**:
	+ Receive
	+ Confirm
* **Actions**:
	+ Accepts friendships when there is a keyword in the hello text.
	+ Invites users to WeChat groups.

### on_room_join Method

* **Parameter**: `room` and `invitees` (required)
* **Description**: Handles room join events.
* **Actions**:
	+ Adds contacts to rooms.

### main Method

* **No parameters**
* **Description**: Starts the bot.
* **Actions**:
	+ Creates an instance of MyBot and starts it.

---

Here is the API documentation for the provided source code:

**bot.py**

### on_ready Event

* Listen for on-ready event
* Parameters: `EventReadyPayload`
* Returns: `None`

### on_message Event

#### Listening for Message

* Listen for message event
* Parameters:
	+ `Message`: The received message
* Returns: `None`

#### Handling Message Types

* Handles various message types based on their content
* Supported message types:
	+ MESSAGE_TYPE_IMAGE
	+ MESSAGE_TYPE_AUDIO
	+ MESSAGE_TYPE_ATTACHMENT
	+ MESSAGE_TYPE_VIDEO
	+ MESSAGE_TYPE_MINI_PROGRAM
* Actions taken for each message type:
	+ IMAGE: Save the image to file and reply with it
	+ AUDIO/ATTACHMENT/VIDEO: Save the file to disk
	+ MINI_PROGRAM: Reply with the mini-program

#### Room Member Management

* Handles room member-related commands
* Supported commands:
	+ `get room members`: Retrieve a list of room members and send it back
	+ `remove room member:<name>`: Remove a room member by name (if authorized)
	+ `get room topic`: Retrieve the current room topic and send it back
	+ `rename room topic:<new_topic>`: Rename the room topic

#### Friendship Management

* Handles friendship-related commands
* Supported commands:
	+ `add new friend:<identity_info>`: Add a new friend (WeChat or phone-based) to the bot's friend list
	+ `at me`: Send a message at the bot itself in the current room
	+ `my alias`: Retrieve and send back the bot's current alias
	+ `set alias:<new_alias>`: Set a new alias for the bot

#### Contact Management

* Handles contact-related commands
* Supported commands:
	+ `find friends:<friend_name>`: Search for contacts with a given name and send back the results

### on_login Event

* Login event handler
* Parameters: `Contact` - The logged-in account
* Returns: `None`

### on_friendship Event

* Friendship-related event handler
* Parameters: `Friendship` - Contains information about the friendship (e.g., hello text, friend contact object)
* Returns: `None`

---

**bot.py**

### Room Join Event API

#### on_room_join

* Summary: Triggered when new contacts join a room
* Method: `on_room_join`
* Parameters:
	+ `room` (Room): the room instance
	+ `invitees` (List[Contact]): the new contacts to the room
	+ `inviter` (Contact): the inviter who shared the QR code or manually invited someone
	+ `date` (datetime): the datetime when the new contacts joined the room
* Returns: None