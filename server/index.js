import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cron from 'node-cron';

import inventoryRoutes from './routes/inventory.js';
import loanRoutes from './routes/loanTransaction.js';
import { deleteOldDrafts } from './controllers/inventory.js';

const app = express()
dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(express.json());
app.use(cors())
app.use(cookieParser())

app.use("/service/inventory", inventoryRoutes)
app.use("/service/loan", loanRoutes)

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT
const DB_NAME = process.env.DB_NAME;

mongoose.set("strictQuery", true)

mongoose.connect(CONNECTION_URL, { dbName: DB_NAME })
    .then(() => {
        // Schedule a cron job: run every day at 00:00 (midnight).
        cron.schedule("0 0 * * *", () => {
            console.log("Running scheduled job to delete old draft inventories...");
            deleteOldDrafts();
        });

        // Start the server after cron job setup
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((error) => console.log(error.message));