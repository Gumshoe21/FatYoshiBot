const dotenv = require('dotenv');
const tmi = require('tmi.js');
// create a new instance of the tmi client
const client = new tmi.Client({
  connection: {
    // option to reconnect the client if disconnected
    reconnect: true
  },
  // channels the bot will listen to
  channels: [process.env.TWITCH_USER_CHANNEL_NAME],
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_OAUTH_TOKEN
  }
});

client.connect();

// event listeners

// message event
client.on('message', messageHandler);

// message event callback fn
// chan (channel) = channel name including the '#'; ctx (context) = includes the username; msg (message): the uh... message.
const messageHandler = async (chan, ctx, msg, self) => {
  if (self) {
    return;
  }
  console.log('channel', {
    channel,
    user: context.username,
    message
  });
};
