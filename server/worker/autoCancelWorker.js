import amqp from "amqplib";
import dotenv from "dotenv";
import { processAutoCancel } from "../controllers/loanTransaction.js";
import { connectMongoDB } from "../utils/db.js";

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const QUEUE_NAME = "loan_auto_cancel";

export const startWorker = async () => {
  try {
    await connectMongoDB();
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Connected to RabbitMQ queue: ${QUEUE_NAME}`);

    channel.consume(QUEUE_NAME, async (msg) => {
      if (msg !== null) {
        try {
          const { loanTransactionId } = JSON.parse(msg.content.toString());
          console.log(`Processing auto-cancel for LoanTransaction ID: ${loanTransactionId}`);

          await processAutoCancel(loanTransactionId);

          channel.ack(msg);
          console.log(`LoanTransaction ID: ${loanTransactionId} successfully auto-cancelled.`);
        } catch (error) {
          console.error(`Error processing loan transaction:`, error);
          channel.nack(msg, false, true);
        }
      }
    });

    console.log("Auto-cancel worker is now running...");
  } catch (error) {
    console.error("Error in RabbitMQ worker:", error);
    process.exit(1);
  }
};
