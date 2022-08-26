import User from '../models/User';

exports.incrementUserValue = (
  username: string,
  value: number,
  amount: number
) => {
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
