import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import inventoryRoutes from './routes/inventory.js';
import loanRoutes from './routes/loanTransaction.js';
import notificationRoutes from './routes/notification.js';
import meetingRoutes from './routes/meeting.js';

import { connectRabbitMQ } from './utils/rabbitmq.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import { sanitizeInput } from './middleware/sanitizeMiddleware.js';

const app = express()
dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(express.json());

const corsOptions = {
    origin: "*",
    credentials: false,
};

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT
const DB_NAME = process.env.DB_NAME;

app.use(cors(corsOptions))
app.use(cookieParser())

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
                styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
                imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
                connectSrc: [
                    "'self'",
                    process.env.INTERNET_SERVER,
                ],
            },
        },
    })
);

// Ensure trust for reverse proxies (e.g., Nginx or cloud hosting)
app.set('trust proxy', true);

app.use(sanitizeInput);

app.use("/service/inventory", inventoryRoutes)
app.use("/service/loan", loanRoutes)
app.use("/service/notification", notificationRoutes)
app.use("/service/meeting", meetingRoutes)

app.use(errorHandler)

mongoose.set("strictQuery", true)

mongoose.connect(CONNECTION_URL, { dbName: DB_NAME })
    .then(async () => {

        // connect to rabbitMQ
        await connectRabbitMQ()

        // Start the server after cron job setup
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    })
    .catch((error) => console.log(error.message));