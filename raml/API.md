# API Services API documentation version 1
/api/v1

### TODO
Put your stuff here!

---

## Error
When an error is encountered by a client, it will send diagnositc information to this service which will log the information for later analysis.

### /errors

* **post**: Add a new error to the collection

## Users
Management of user resources

### /users

* **post** *(secured)*: Add a new user to the collection

* **get** *(secured)*: Get a list of user

### /users/count

* **get** *(secured)*: Gets a count on the collection query

### /users/{id}
Management of a user resource

* **put**: Update a specific user

* **delete**: Deletes a specific user

* **get** *(secured)*: Get a specific user

## Login
Management of user authorizations

### /login

* **post**: Authenticate the user via email & password

* **delete** *(secured)*: Clears current session and logs user out of the application.

* **put** *(secured)*: Returns an updated token with an extended expiration.
This will be invoked by the client when the user has been actively using the client but not in ways that have resulted in a other service calls.  It allows the client to prevent the user from being timed out unnecessarily.

## /surveys
Management of survey resources

### /surveys

* **post** *(secured)*: Add a new survey to the collection

* **get** *(secured)*: Get a list of survey

### /surveys/current
Management of a current resource

* **get** *(secured)*: Get a specific current

### /surveys/{surveyId}
Management of a survey resource

* **put** *(secured)*: Update a specific survey

* **delete** *(secured)*: Deletes a specific survey

* **get** *(secured)*: Get a specific survey

