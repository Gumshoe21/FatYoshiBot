const User = require('../models/User');

exports.incrementUserValue = (username, value, amount) => {
  const user = User.findOneAndUpdate({ username },
    {
      $inc: { [`values.${value}`]: amount }
    },
    {
      upsert: true,
      new: true
    }
  )
  return user;
}

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
