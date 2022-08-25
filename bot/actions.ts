const User = require('../models/User');

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
