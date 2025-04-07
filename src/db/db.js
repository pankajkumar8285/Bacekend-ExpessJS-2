import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";


const connectDB = async() => {
    const DB_URI = process.env.DB_URI;
    try {
        const connectionInstance = await mongoose.connect(DB_URI);
        console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch(error) {
        console.log("MongoDB connection error ", error);
        process.exit(1)
    }
}


export default connectDB;