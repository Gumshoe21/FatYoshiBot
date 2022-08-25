const Value = require('./../models/Value');
const { incrementUserValue } = require('./actions');
const { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } = require('./../constants');

exports.rewards = {
  [`${REWARD_FEED_FAT_YOSHI}`]: {
    onReward: async ({ username }) => {
      const user = await incrementUserValue(
        username,
        'fatYoshiWeightContributed',
        1
      );
      const fatYoshiWeight = await Value.find({ name: 'fatYoshiWeight' });
      const { num: weight } = fatYoshiWeight;
      const { fatYoshiWeightContributed: contributed } = user.values;
      return `${EMOTE_FAT_YOSHI} Thanks for feeding me, ${username}! I now weigh ${weight} lbs./${
        weight / 2.2
      } kgs)! You've contributed ${contributed} lbs./${
        contributed / 2.2
      } kgs! Thanks for keeping me fat! ${EMOTE_FAT_YOSHI}`;
    }
  }
};
