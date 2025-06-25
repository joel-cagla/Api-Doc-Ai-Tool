**test_file.py**

### Functions

#### test_funcA
Prints the given value `some_val`.

#### test_funcB
Prints the given value `some_val`.

#### test_funcC
Prints the given value `some_val`.

#### test_funcD
Prints the given value `some_val`.

---

**test_file.py**

### Functions

#### test_funcE(some_val)

* Prints the value of `some_val` to the console.

#### test_funcF(some_val)

* Prints the value of `some_val` to the console.

**another_test_file.py**

### Functions

#### another_test_funcA(argument)

* Returns the argument multiplied by 2, only if the argument is an integer. If not, prints "Enter a number" and returns None.

#### another_test_funcB(argument)

* Returns the argument multiplied by 5, only if the argument is an integer. If not, prints "Enter a number" and returns None.

---

**another_test_file.py**

### Functions

#### another_test_funcC

* **Path:** /v1/funcC
* **Method:** POST
* **Request Body:** 
	+ `argument`: An integer value
* **Response:**
	+ 200 OK: The result of multiplying the input number by 10
	+ Error message (400 Bad Request): If the input is not an integer