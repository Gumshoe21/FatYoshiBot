const User = require('./../models/User');
const updateUser = (username) => {
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
};
