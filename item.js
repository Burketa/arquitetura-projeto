const express = require('express');
const { connectRabbitMQ } = require('./rabbitmq');

const router = express.Router();

// Rota para obter todos os itens
router.get('/', async (req, res) => {
  try {
    const channel = await connectRabbitMQ();

    channel.consume('item_queue', (msg) => {
      const item = JSON.parse(msg.content.toString());
      console.log('Received item:', item);
      channel.ack(msg);

      // Aqui você pode fazer algo com o item recebido, como salvar em um banco de dados, por exemplo.
    }, { noAck: false });

    res.send('Items received successfully.');
  } catch (error) {
    console.error('Error receiving items:', error);
    res.status(500).send('An error occurred while receiving items.');
  }
});

// Rota para criar um novo item
router.post('/', async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const item = { name, quantity };

    const channel = await connectRabbitMQ();

    channel.sendToQueue('item_queue', Buffer.from(JSON.stringify(item)));

    res.send('Item sent successfully.');
  } catch (error) {
    console.error('Error sending item:', error);
    res.status(500).send('An error occurred while sending item.');
  }
});

module.exports = router;