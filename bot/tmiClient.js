const tmi = require('tmi.js');

module.exports = new tmi.Client({
  connection: {
    reconnect: true
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_OAUTH_TOKEN
  },

  channels: ['fatyoshibot']
});
