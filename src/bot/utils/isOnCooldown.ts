const Cooldown = require('../../models/Cooldown');
const { convertMsToSec } = require('./../../helpers/convertMsToSec');
const { getCurrentTimeInMs } = require('./../../helpers/getCurrentTimeInMs');
const { GLOBAL_COOLDOWN_TIME_IN_SECONDS } = require('./../../constants');

exports.isOnCooldown = async (username: string, command: string) => {
  console.log(username);
  // Try to find a cooldown with the provided username and command name in the database. If such a cooldown isn't found, create a new cooldown with the provided username and command name and set the startTime field to the current time in milliseconds, then return false, indicating that there was not a cooldown at the time the command was issued.
  try {
    let cooldown = await Cooldown.findOne({
      username: username.toLowerCase(),
      command: command
    });

    if (!cooldown) {
      cooldown = await Cooldown.create({
        username: username.toLowerCase(),
        command,
        startTime: new Date(Date.now()).getTime()
      });
      return false;
    }

    // if the current time is not equal to the cooldown's startTime, and if 30 seconds hasn't passed since the cooldown's startTime, return true, indicating that there is an active cooldown. Otherwise, delete the current cooldown, as it has expired, and return false, indicating that there is no active cooldown.
    if (
      convertMsToSec(getCurrentTimeInMs()) !==
        convertMsToSec(cooldown.startTime) &&
      convertMsToSec(getCurrentTimeInMs()) -
        convertMsToSec(cooldown.startTime) <
        30
    ) {
      return true;
    } else {
      await Cooldown.deleteOne({ username, command });
      cooldown = await Cooldown.create({
        username,
        command,
        startTime: new Date(Date.now()).getTime()
      });
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
