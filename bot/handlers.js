const tmiClient = require('./tmiClient');
const { commands } = require('./commands');
const { rewards } = require('./rewards');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const { isOnCooldown } = require('./actions');

exports.commandHandler = async (channel, context, message, self) => {
  if (self) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { onCommand } = commands[command] || {};

  console.log(await isOnCooldown(context.username, command));

  let response = await onCommand({ channel, context, message, self });
  const canSay = await isOnCooldown(context.username, command);
  console.log(`canSay: ${canSay}`);
  if (!canSay) tmiClient.say(channel, response);
};

exports.redemptionHandler = async (channel, userName, type, tags, message) => {
  if (self) return;

  const { onCommand } = rewards[type];
  let response = await onCommand({ channel, userName, type, tags, message });
  tmiClient.say(channel, response);
};
