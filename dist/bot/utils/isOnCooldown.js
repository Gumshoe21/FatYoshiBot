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
const Cooldown = require('../../models/Cooldown');
const { convertMsToSec } = require('./../../helpers/convertMsToSec');
const { getCurrentTimeInMs } = require('./../../helpers/getCurrentTimeInMs');
const { GLOBAL_COOLDOWN_TIME_IN_SECONDS } = require('./../../constants');
exports.isOnCooldown = (username, command) => __awaiter(void 0, void 0, void 0, function* () {
    // Try to find a cooldown with the provided username and command name in the database. If such a cooldown isn't found, create a new cooldown with the provided username and command name and set the startTime field to the current time in milliseconds.
    try {
        let cooldown = yield Cooldown.findOne({
            username: username,
            command: command
        });
        if (!cooldown) {
            cooldown = yield Cooldown.create({
                username,
                command,
                startTime: new Date(Date.now()).getTime()
            });
        }
        //
        console.log(Math.floor(cooldown.startTime / 1000));
        // Store the current time in milliseconds in a variable.
        const now = new Date(Date.now()).getTime();
        console.log(Math.floor(new Date(Date.now()).getTime() / 1000));
        // if the current time is not equal to the cooldown's startTime, and if 30 seconds hasn't passed since the cooldown's startTime, return true, indicated that there is an active cooldown. Otherwise, delete the current cooldown, as it has expired, and return false, indicating that there is no active cooldown.
        if (convertMsToSec(getCurrentTimeInMs()) !==
            convertMsToSec(cooldown.startTime) &&
            convertMsToSec(getCurrentTimeInMs()) -
                convertMsToSec(cooldown.startTime) <
                30) {
            return true;
        }
        else {
            yield Cooldown.deleteOne({ username: username, command: command });
            cooldown = yield Cooldown.create({
                username,
                command,
                startTime: new Date(Date.now()).getTime()
            });
            return false;
        }
    }
    catch (err) {
        console.log(err);
    }
});
//# sourceMappingURL=isOnCooldown.js.map