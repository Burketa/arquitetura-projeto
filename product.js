const express = require('express');
const { connectRabbitMQ } = require('./rabbitmq');

const router = express.Router();

// Rota para obter todos os produtos
router.get('/', async (req, res) => {
  try {
    const channel = await connectRabbitMQ();

    channel.consume('product_queue', (msg) => {
      const product = JSON.parse(msg.content.toString());
      console.log('Received product:', product);
      channel.ack(msg);

      // Aqui você pode fazer algo com o produto recebido, como salvar em um banco de dados, por exemplo.
    }, { noAck: false });

    res.send('Products received successfully.');
  } catch (error) {
    console.error('Error receiving products:', error);
    res.status(500).send('An error occurred while receiving products.');
  }
});

// Rota para criar um novo produto
router.post('/', async (req, res) => {
  try {
    const { name, price } = req.body;
    const product = { name, price };

    const channel = await connectRabbitMQ();

    channel.sendToQueue('product_queue', Buffer.from(JSON.stringify(product)));

    res.send('Product sent successfully.');
  } catch (error) {
    console.error('Error sending product:', error);
    res.status(500).send('An error occurred while sending product.');
  }
});

module.exports = router;