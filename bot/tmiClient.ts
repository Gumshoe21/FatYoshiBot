import tmi from 'tmi.js';

const options: tmi.Options = {
  connection: {
    reconnect: true
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_OAUTH_TOKEN
  },

  channels: ['gumshoe21']
};

const tmiClient: tmi.Client = new tmi.Client(options);

module.exports = tmiClient;
