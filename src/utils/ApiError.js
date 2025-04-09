// We are creating a custom error class named ApiError.
// It extends the built-in JavaScript Error class so it behaves like a normal error, but with extra custom features.
// Useful for making your error responses consistent in an API.
class ApiError extends Error {

// This is the constructor method. It runs when we create a new ApiError.
// statusCode: HTTP status code like 404, 500, etc.
// message: Error message. Default is "Something went wrong" if no message is passed.
// errors: Optional detailed errors (like from Mongoose validation).
// stack: Optional stack trace (developer info about where the error occurred).
    constructor( 
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = "" 
    ){
        super()  //Calls the parent Error class constructor 
        this.statusCode = statusCode //Sets the HTTP status code on the error object (e.g. 404 for "Not Found").
        this.data = null      ///Sets the data property to null. You might return this field in error responses when no data is available.
        this.message = message  //Sets the error message.
        this.success = false  //Sets a success flag to false so that error responses clearly indicate failure.
        this.errors = errors   //Stores any detailed error list (e.g., multiple validation errors).

        if (stack) {
            this.stack = stack;  //If a custom stack trace is passed, use that instead of generating a new one.
        } 
        else {
            Error.captureStackTrace(this, this.constructor)  //If no custom stack, generate a new stack trace for debugging.
                                                            //Helps you trace where the error came from in the code.
            
            
        }
    }
    

}

export {ApiError}