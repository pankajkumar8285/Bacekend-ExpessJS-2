// We are creating a custom class called ApiResponse.
// The purpose of this class is to create a standard format for successful API responses.
class ApiResponse {

// This is the constructor, which gets called when we create a new ApiResponse object.
// statusCode: HTTP status code like 200 (OK), 201 (Created).
// data: The actual data that you want to send back (like user info, products, etc.).
// message: Optional. A human-readable message. Default is "Success".
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode  //Saves the statusCode into the object so we can return it in the response.
        this.data = data  //Saves the actual data being returned in the API response (like user details, token, etc.).
        this.message = message  //Sets the message that gives feedback about what the response is (like "User logged in" or "Product created").
        this.success =  statusCode < 400   //
    }
}


export {ApiResponse};