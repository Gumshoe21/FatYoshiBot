const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const tmiClient = require('./bot/tmiClient');
const { commandHandler, redemptionHandler } = require('./bot/handlers');
const Value = require('./models/Value');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then((con) => console.log('Database connection successful.'));

tmiClient.connect();

tmiClient.on('message', commandHandler);
tmiClient.on('redeem', redemptionHandler);
