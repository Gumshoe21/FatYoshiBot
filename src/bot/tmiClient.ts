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

const tmiClient = new tmi.Client(options);

export default tmiClient;
