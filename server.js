const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const tmiClient = require('./tmiClient');
const { commandHandler } = require('./src/bot/listeners');
// MongoDB

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then((con) => console.log('Database connection successful.'));

tmiClient.connect();

tmiClient.on('message', commandHandler);
