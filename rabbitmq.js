const amqp = require('amqplib');

const connectRabbitMQ = async () => {
  const QUEUE_NAME = 'arquitetura';
  const RABBITMQ_URL = 'amqp://rabbit@77a889a3e15f';//'amqp://localhost';

  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME);

    return channel;
  } catch (error) {
    console.error('Error connecting to RabbitMQ:', error);
    throw error;
  }
};

module.exports = {
  connectRabbitMQ,
};