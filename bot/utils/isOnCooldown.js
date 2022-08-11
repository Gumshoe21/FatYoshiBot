const Cooldown = require('../../models/Cooldown');
const { convertMsToSec } = require('./../../helpers/convertMsToSec');
const { getCurrentTimeInMs } = require('./../../helpers/getCurrentTimeInMs');

exports.isOnCooldown = async (username, command) => {
  try {
    let cooldown = await Cooldown.findOne({
      username: username,
      command: command
    });

    if (!cooldown) {
      cooldown = await Cooldown.create({
        username,
        command,
        startTime: new Date(Date.now()).getTime()
      });
    }
    console.log(Math.floor(cooldown.startTime / 1000));
    const now = new Date(Date.now()).getTime();

    console.log(Math.floor(new Date(Date.now()).getTime() / 1000));
    if (
      convertMsToSec(getCurrentTimeInMs()) !==
        convertMsToSec(cooldown.startTime) &&
      convertMsToSec(getCurrentTimeInMs()) -
        convertMsToSec(cooldown.startTime) <
        30
    ) {
      return true;
    } else {
      await Cooldown.deleteOne({ username: username, command: command });
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
