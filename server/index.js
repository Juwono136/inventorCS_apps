import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { connectMongoDB } from './utils/db.js';

import inventoryRoutes from './routes/inventory.js';
import loanRoutes from './routes/loanTransaction.js';
import notificationRoutes from './routes/notification.js';
import meetingRoutes from './routes/meeting.js';

import { connectRabbitMQ } from './utils/rabbitmq.js';
import { startWorker } from './worker/autoCancelWorker.js';

import { errorHandler } from './middleware/errorMiddleware.js';
import { sanitizeInput } from './middleware/sanitizeMiddleware.js';

const app = express()
dotenv.config()

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(express.json());

const PORT = process.env.PORT

const corsOptions = {
    origin: "*",
    credentials: false,
};

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

const startServer = async () => {
    try {
        await connectMongoDB();
        await connectRabbitMQ();
        startWorker();

        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1);
    }
};

startServer();