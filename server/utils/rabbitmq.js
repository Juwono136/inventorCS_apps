import amqp from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

let connection;
let channel;

export const connectRabbitMQ = async () => {
    try {
        connection = await amqp.connect(RABBITMQ_URL);
        channel = await connection.createChannel();
        console.log("Connected to RabbitMQ");
    } catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
    }
};

export const getChannel = () => {
    if (!channel) {
        console.error("RabbitMQ channel is not available.");
    }
    return channel;
};

export const closeRabbitMQ = async () => {
    if (channel) await channel.close();
    if (connection) await connection.close();
};
