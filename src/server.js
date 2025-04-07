import dotenv from "dotenv"
import connectDB from "./db/db.js"
import  { app }  from './app.js';




dotenv.config({path : './env'})

connectDB().then(() => {
    app.listen(process.env.PORT || 5500, () => {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
    app.on("error",(error) => {
        console.log("ERR: ",error);
        throw error;
    });
}).catch((error) => {
    console.log('MongoDB connection failed !!! ', error)
})















//console.log(PORT);

// import express from 'express'
// const app = express();

// ;(async() => {
//     try {
//         mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
//         app.on("error",(error) => {
//             console.log("ERR: ",error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listining on port ${process.env.PORT}`)
//         })

//     } catch(error) {
//         console.error("Error: ",error);
//         throw error;
        
//     }
// })