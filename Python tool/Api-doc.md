**test_file.py**

**Functions**

* **test_funcA(some_val)**
	+ Prints the value of `some_val` using f-string formatting.
* **test_funcB(some_val)**
	+ Prints the value of `some_val` using f-string formatting.
* **test_funcC(some_val)**
	+ Prints the value of `some_val` using f-string formatting.
* **test_funcD(some_val)**
	+ Prints the value of `some_val` using f-string formatting.

---

**test_file.py**

### Functions

#### test_funcE(some_val)

Prints the value of `some_val` to the console.

**Request Body:** `some_val`: String or other serializable type

**Response:** None

#### test_funcF(some_val)

Prints the value of `some_val` to the console.

**Request Body:** `some_val`: String or other serializable type

**Response:** None

**another_test_file.py**

### Functions

#### another_test_funcA(argument)

Returns the argument multiplied by 2, only if the argument is an integer. If not, prints "Enter a number" and returns none.

**Request Body:** `argument`: Integer or other serializable type

**Response:** `argument * 2` (Integer)

#### another_test_funcB(argument)

Returns the argument multiplied by 5, only if the argument is an integer. If not, prints "Enter a number" and returns none.

**Request Body:** `argument`: Integer or other serializable type

**Response:** `argument * 5` (Integer)

---

**another_test_file.py**

### another_test_funcC

**Method:** `another_test_funcC`

**Description:** Returns the input argument multiplied by 10.

**Parameters:**

* **argument**: An integer value to be processed.

**Returns:** The result of multiplying the input argument by 10.

**Example:**
```python
result = another_test_funcC(5)  # returns 50
```

**test_classes.py**

### __init__

**Method:** `__init__`

**Description:** Initializes an instance of a class with given name and some value.

**Parameters:**

* **name**: A string value representing the name of the instance.
* **some_val**: An integer or other comparable value.

**Returns:** None

**Example:**
```python
my_instance = test_classes("John", 42)  # initializes an instance with name "John" and some value 42
```

### get_name

**Method:** `get_name`

**Description:** Returns the name of the instance.

**Parameters:** None

**Returns:** A string representing the instance's name.

**Example:**
```python
print(my_instance.get_name())  # prints "John"
```

### get_val

**Method:** `get_val`

**Description:** Returns the some value of the instance.

**Parameters:** None

**Returns:** The integer or comparable value associated with the instance.

**Example:**
```python
print(my_instance.get_val())  # prints 42
```