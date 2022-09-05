"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmiClient_1 = __importDefault(require("./tmiClient"));
const { commands } = require('./commands');
const { rewards } = require('./rewards');
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);
const { isOnCooldown } = require('./utils/isOnCooldown');
const { isCommand } = require('./../helpers/isCommand');
exports.commandHandler = (channel, context, message, self) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(context);
    // If our message isn't formatted like a command (i.e., preceded by a '!'), exit fn.
    if (!isCommand(message))
        return;
    // If the user is the bot itself, exit fn.
    if (self)
        return;
    // Separate the raw message, the command itself, and any args into variables.
    const [raw, command, argument] = message.match(regexpCommand);
    // Obtain the onCommand fn from the command to which it belongs.
    const { onCommand } = commands[command] || {};
    // If the command doesn't exist, exit fn.
    if (!commands[command])
        return;
    //  console.log(await isOnCooldown(context.username, command));
    // Execute the onCommand fn, await its response, and store it in a var.
    let response = yield onCommand({ channel, context, message, self });
    // Execute the isOnCooldown fn and await its response, which will be either true if there is an active cooldown or false if there isn't one.
    const cooldownIsActive = yield isOnCooldown(context.username, command);
    // console.log(`canSay: ${canSay}`);
    // If there isn't an active cooldown, convey the response to the channel in a message.
    if (!cooldownIsActive)
        tmiClient_1.default.say(channel, response);
});
exports.rewardHandler = (channel, username, type, tags, message) => __awaiter(void 0, void 0, void 0, function* () {
    // If a reward with that reward id isn't present in the list of rewards, exit fn.
    if (!rewards[type])
        return;
    // If the redeemer is the bot itself, exit fn.
    // Obtain the onReward fn from the reward to which it belongs.
    const { onReward } = rewards[type] || {};
    // Execute the onReward fn, await its response, and store it in a var.
    let response = yield onReward({ channel, username, type, tags, message });
    // Convey the response to the channel in a message.
    tmiClient_1.default.say(channel, response);
});
//# sourceMappingURL=handlers.js.map