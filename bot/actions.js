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
    let cooldown = Cooldown.findOne({
      username: username,
      command: command
    });

    if (!cooldown) {
      cooldown = await Cooldown.create({
        username,
        command,
        startTime: new Date(Date.now())
      });
    }

    if (
      Math.floor(+new Date(Date.now()) * 1000) -
        Math.floor(+cooldown.startTime) * 1000 <
      30
    ) {
      return true;
    } else {
      Cooldown.deleteOne({ username: username, command: command });
      return false;
    }
  } catch (err) {
    console.log(err);
  }
};
