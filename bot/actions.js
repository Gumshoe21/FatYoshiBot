const User = require('../models/User');
const Cooldown = require('../models/Cooldown');

exports.incrementUserValue = (username, value, amount) => {
  const user = User.findOneAndUpdate(
    { username },
    {
      $inc: { [`values.${value}`]: amount }
    },
    {
      upsert: true,
      new: true
    }
  );
  return user;
};

exports.isOnCooldown = async (username, command) => {
  let cooldownActive = false;
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
      msToSec(currentTimeInMs()) !== msToSec(cooldown.startTime) &&
      msToSec(currentTimeInMs()) - msToSec(cooldown.startTime) < 30
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

const msToSec = (ms) => {
  return Math.floor(ms / 1000);
};

const currentTimeInMs = () => {
  return new Date(Date.now()).getTime();
};
