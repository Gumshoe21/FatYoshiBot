const tmiClient = require('./tmiClient');
const { commands } = require('./commands');
const { rewards } = require('./rewards');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

exports.commandHandler = async (channel, context, message, self) => {
  if (self) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { onCommand } = commands[command] || {};

  response = await onCommand({ channel, context, message, self });

  tmiClient.say(channel, response);
};

exports.redemptionHandler = async (channel, userName, type, tags, message) => {
  if (self) return;

  const { onCommand } = rewards[type];

  response = await onCommand({ channel, userName, type, tags, message });

  tmiClient.say(channel, response);
};