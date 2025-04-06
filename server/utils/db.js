import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const CONNECTION_URL = process.env.CONNECTION_URL;
const DB_NAME = process.env.DB_NAME;

export const connectMongoDB = async () => {
    try {
        mongoose.set("strictQuery", true)

        await mongoose.connect(CONNECTION_URL, {
            dbName: DB_NAME
        });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
};