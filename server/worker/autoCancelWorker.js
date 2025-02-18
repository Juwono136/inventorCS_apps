import amqp from "amqplib";
import dotenv from "dotenv";
import { processAutoCancel } from "../controllers/loanTransaction.js";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

const startWorker = async () => {
    try {
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = "loan_auto_cancel";

        await channel.assertQueue(queue, { durable: true });

        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                const { loanTransactionId } = JSON.parse(msg.content.toString());
                console.log(`Processing auto-cancel for LoanTransaction ID: ${loanTransactionId}`);
                await processAutoCancel(loanTransactionId);
                channel.ack(msg);
            }
        });

        console.log("Auto-cancel worker is running...");
    } catch (error) {
        console.error("Error in RabbitMQ worker:", error);
    }
};

startWorker();
