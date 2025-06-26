**test_file.py**

**Functions**

### test_funcA(some_val)

Prints the value of `some_val`.

### test_funcB(some_val)

Prints the value of `some_val`.

### test_funcC(some_val)

Prints the value of `some_val`.

### test_funcD(some_val)

Prints the value of `some_val`.

---

**test_file.py**

### Functions

#### test_funcE(some_val)

Prints the value of `some_val` to the console.

##### Parameters:

* `some_val`: The value to be printed.

#### test_funcF(some_val)

Prints the value of `some_val` to the console.

##### Parameters:

* `some_val`: The value to be printed.

**another_test_file.py**

### Functions

#### another_test_funcA(argument)

Multiplies the input `argument` by 2 and returns the result. If the input is not an integer, prints an error message.

##### Parameters:

* `argument`: The number to be multiplied.

#### another_test_funcB(argument)

Multiplies the input `argument` by 5 and returns the result. If the input is not an integer, prints an error message.

##### Parameters:

* `argument`: The number to be multiplied.

---

**another_test_file.py**

### another_test_funcC

* **Path:** /v1/another_test_funcC
* **Method:** POST
* **Request Body:** `argument`
* **Response:** `argument * 10`

If the request body is not an integer, returns "Enter a number" as a response.

**test_classes.py**

### __init__

* **Path:** /v1/classes/{name}
* **Method:** POST
* **Request Body:** `name`, `some_val`
* **Response:** None

Initializes a new class with the given name and some value.

### get_name

* **Path:** /v1/classes/{name}/name
* **Method:** GET
* **Request Body:** None
* **Response:** `self.name`

Returns the name of the initialized class.

### get_val

* **Path:** /v1/classes/{name}/val
* **Method:** GET
* **Request Body:** None
* **Response:** `self.some_val`

Returns the some value of the initialized class.