const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
import tmiClient from './bot/tmiClient';
const {
  commandHandler,
  rewardHandler,
  timerHandler
} = require('./bot/handlers');
const Value = require('./models/Value');
const app = require('./app');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  })
  .then((_con) => console.log('Database connection successful.'));

tmiClient.connect();

tmiClient.on('message', commandHandler);
tmiClient.on('redeem', rewardHandler);
tmiClient.on('connected', timerHandler);

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1); // code 0 = success; code 1 = uncaught exception
});

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {});
process.on('unhandledRejection', (_err) => {
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  server.close(() => {});
});
