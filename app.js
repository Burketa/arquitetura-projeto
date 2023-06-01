const express = require('express');
const product = require('./product');
const item = require('./item');
const order = require('./order');

const app = express();

app.use(express.json());

app.use('/products', product);
app.use('/items', item);
app.use('/orders', order);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});