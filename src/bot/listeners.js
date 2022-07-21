const tmiClient = require('./../../tmiClient');
const dotenv = require('dotenv').config();
const { commands } = require('./commands');

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
exports.commandHandler = async (channel, context, message, self) => {
  if (self) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { response } = commands[command] || {};

  let responseMessage = response;

  if (typeof responseMessage === 'function') {
    responseMessage = response(argument);
  }

  if (responseMessage) {
    console.log(`Responding to command !${command}`);
    tmiClient.say(channel, responseMessage);
  } else {
    console.log('hi');
  }
};
