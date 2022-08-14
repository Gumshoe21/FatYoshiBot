const tmiClient = require('./tmiClient');
const { commands } = require('./commands');
const { rewards } = require('./rewards');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const { isOnCooldown } = require('./utils/isOnCooldown');
const { isCommand } = require('./../helpers/isCommand');

exports.commandHandler = async (channel, context, message, self) => {
  if (!isCommand(message)) return;
  if (self) return;

  const [raw, command, argument] = message.match(regexpCommand);

  const { onCommand } = commands[command] || {};
  if (commands[command] === {}) return;
  console.log(await isOnCooldown(context.username, command));

  let response = await onCommand({ channel, context, message, self });
  const canSay = await isOnCooldown(context.username, command);
  console.log(`canSay: ${canSay}`);
  if (!canSay) tmiClient.say(channel, response);
};

exports.redemptionHandler = async (channel, username, type, tags, message) => {
  if (!rewards[type]) return;
  if (self) return;

  const { onRedemption } = rewards[type];

  let response = await onRedemption({ channel, username, type, tags, message });
  tmiClient.say(channel, response);
};
