const express = require('express');
const { connectRabbitMQ } = require('./rabbitmq');

const router = express.Router();

// Rota para obter todos os pedidos
router.get('/', async (req, res) => {
  try {
    const channel = await connectRabbitMQ();

    channel.consume('order_queue', (msg) => {
      const order = JSON.parse(msg.content.toString());
      console.log('Received order:', order);
      channel.ack(msg);

      // Aqui você pode fazer algo com o pedido recebido, como processar o pagamento ou atualizar o status do pedido, por exemplo.
    }, { noAck: false });

    res.send('Orders received successfully.');
  } catch (error) {
    console.error('Error receiving orders:', error);
    res.status(500).send('An error occurred while receiving orders.');
  }
});

// Rota para criar um novo pedido
router.post('/', async (req, res) => {
  try {
    const { customer, items } = req.body;
    const order = { customer, items };

    const channel = await connectRabbitMQ();

    channel.sendToQueue('order_queue', Buffer.from(JSON.stringify(order)));

    res.send('Order sent successfully.');
  } catch (error) {
    console.error('Error sending order:', error);
    res.status(500).send('An error occurred while sending order.');
  }
});

module.exports = router;