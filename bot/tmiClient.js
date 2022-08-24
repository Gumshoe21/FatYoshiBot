"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmi_js_1 = __importDefault(require("tmi.js"));
const options = {
    connection: {
        reconnect: true
    },
    identity: {
        username: process.env.TWITCH_BOT_USERNAME,
        password: process.env.TWITCH_BOT_OAUTH_TOKEN
    },
    channels: ['gumshoe21']
};
const tmiClient = new tmi_js_1.default.Client(options);
module.exports = tmiClient;
