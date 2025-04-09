// const asynchandler = (fn) => async(req, res, next) {
//     try {
//         await fn(req , res, next)

//     } catch (error) {
//         res.status(error.code || 500).json({
//             success: false,
//             message: error.message
//         })
//     }
// }



// We're creating a higher-order function (a function that returns another function).
// It accepts requestHandler, which is your async controller function (like loginUser, registerUser, etc.).
const asynchandler = (requestHandler) => {
    return (req, res, next) => {       //It returns a new middleware function that Express understands: it takes (req, res, next).
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };       //This line calls your controller function and wraps it inside Promise.resolve().
          // This ensures that whether your controller throws an error synchronously or asynchronously, it will be handled properly.
};



export{asynchandler}