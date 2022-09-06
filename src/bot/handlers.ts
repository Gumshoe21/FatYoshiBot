import tmiClient from './tmiClient';
const { commands } = require('./commands');
const { rewards } = require('./rewards');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const { isOnCooldown } = require('./utils/isOnCooldown');
const { isCommand } = require('./../helpers/isCommand');
const { setAsyncInterval } = require('./../helpers/asyncTimeout');
exports.commandHandler = async (channel, context, message, self) => {
  // console.log(context);
  // If our message isn't formatted like a command (i.e., preceded by a '!'), exit fn.
  if (!isCommand(message)) return;

  // If the user is the bot itself, exit fn.
  if (self) return;

  // Separate the raw message, the command itself, and any args into variables.
  const [raw, command, argument] = message.match(regexpCommand);

  // Obtain the onCommand fn from the command to which it belongs.
  const { onCommand } = commands[command] || {};

  // If the command doesn't exist, exit fn.
  if (!commands[command]) return;
  //  console.log(await isOnCooldown(context.username, command));

  // Execute the onCommand fn, await its response, and store it in a var.
  let response = await onCommand({ channel, context, message, self });

  // Execute the isOnCooldown fn and await its response, which will be either true if there is an active cooldown or false if there isn't one.
  const cooldownIsActive = await isOnCooldown(context.username, command);

  // console.log(`canSay: ${canSay}`);

  // If there isn't an active cooldown, convey the response to the channel in a message.
  if (!cooldownIsActive) tmiClient.say(channel, response);
};

exports.rewardHandler = async (channel, username, type, tags, message) => {
  // If a reward with that reward id isn't present in the list of rewards, exit fn.
  if (!rewards[type]) return;
  // If the redeemer is the bot itself, exit fn.

  // Obtain the onReward fn from the reward to which it belongs.
  const { onReward } = rewards[type] || {};

  // Execute the onReward fn, await its response, and store it in a var.
  let response = await onReward({ channel, username, type, tags, message });
  // Convey the response to the channel in a message.
  tmiClient.say(channel, response);
};

exports.timerHandler = async () => {
  const fatYoshiQuoteTimer = await setAsyncInterval(() => {
    tmiClient.say(`${process.env.TWITCH_USER_CHANNEL_NAME}`, '---test---');
  }, 1000);
};
