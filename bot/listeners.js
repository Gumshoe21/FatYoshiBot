const tmiClient = require('./tmiClient');
const { commands } = require('./commands');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

exports.commandHandler = async (channel, context, message, self) => {
  if (self) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { onCommand } = commands[command] || {};

  console.log(`Responding to command !${command}`);
  response = await onCommand();
  tmiClient.say(channel, response);
};
