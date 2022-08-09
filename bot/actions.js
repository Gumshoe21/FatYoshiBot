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
  let cooldown = await Cooldown.find({ username, command });
  if (!cooldown) {
    cooldown = await Cooldown.create({
      username,
      command,
      length: new Date(Date.now())
    });
    return false;
  }
  if (new Date(Date.now()) - cooldown.length >= 30) {
    return true;
  } else {
    await Cooldown.deleteOne({ username, command });
    return false;
  }
};
/*
  const user = User.findOneAndUpdate(
    { username },
    {
      $inc: { ['values.fatYoshiWeightContributed']: 1 }
    },
    {
      upsert: true,
      new: true
    }
  );
  return user;
};

exports.updateUserScore = (username, score) => {
  const user = User.findOneAndUpdate({ username }, {
    $inc: { ['values.score']: score }
  },
    {
      upsert: true,
      new: true,
    }
  );
  return user;
}
*/
