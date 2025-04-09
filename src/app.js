//This imports Express.js, the web framework used to build APIs.
//It helps handle HTTP requests (like GET, POST, PUT, DELETE).
import express from 'express';

// CORS (Cross-Origin Resource Sharing) controls who can access your backend.
// Useful when frontend and backend are on different domains (like React frontend and Node backend).
import cors from "cors";

// Parses cookies sent from the client.
// Used to read JWT tokens or session info from cookies.
import cookieParser from 'cookie-parser';


//creates an app object using Express, which you use to set up routes and middleware.
const app = express();

// Tells Express to automatically parse JSON in the request body.
// Without this, req.body will be undefined when sending JSON data.
app.use(express.json());

//Allows frontend from a specific origin (set in .env via CORS_ORIGIN) to access this backend.
// credentials: true allows cookies to be sent/received.
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Parses form data like x-www-form-urlencoded (used in form submissions).
// extended: true allows nested objects.
// limit: "60kb" restricts the size of the data (to avoid spam attacks or overloading the server).
app.use(express.urlencoded({extended: true, limit: "60kb"}))

// Serves static files (like images, PDFs, etc.) from the public/ folder.
// Example: if you upload an image, it can be accessed from yourdomain.com/image.jpg.
app.use(express.static("public"));

// Initializes cookie parsing.
// After this, you can access cookies via req.cookies.
app.use(cookieParser());

// routes import 

import userRouter from './routes/user.routes.js'

//routes declaration

app.use("/api/v1/users", userRouter)






export {app};
