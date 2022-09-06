"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const tmiClient_1 = __importDefault(require("./bot/tmiClient"));
const { commandHandler, rewardHandler, timerHandler, raidHandler } = require('./bot/handlers');
const Value = require('./models/Value');
const app = require('./app');
mongoose
    .connect(process.env.MONGO_URI, {
    useNewUrlParser: true
})
    .then((_con) => console.log('Database connection successful.'));
tmiClient_1.default.connect();
tmiClient_1.default.on('message', commandHandler);
tmiClient_1.default.on('redeem', rewardHandler);
<<<<<<< HEAD
// tmiClient.on('connected', timerHandler);
=======
tmiClient_1.default.on('connected', timerHandler);
tmiClient_1.default.on('raided', raidHandler);
>>>>>>> e464911 (Added raid event handler.)
process.on('uncaughtException', (err) => {
    console.log(err);
    process.exit(1); // code 0 = success; code 1 = uncaught exception
});
const port = process.env.PORT || 8000;
const server = app.listen(port, () => { });
process.on('unhandledRejection', (_err) => {
    server.close(() => {
        process.exit(1);
    });
});
process.on('SIGTERM', () => {
    server.close(() => { });
});
//# sourceMappingURL=server.js.map