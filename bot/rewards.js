const Value = require('./../models/Value');
const { updateUserWeightContributed } = require('./actions');
const { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } = require('./../constants');

exports.rewards = {
  [`${REWARD_FEED_FAT_YOSHI}`]: {
    onCommand: async ({ userName }) => {
      const user = await updateUserWeightContributed(userName);
      return `${EMOTE_FAT_YOSHI} Thanks for feeding me, ${userName}! I now weigh ${
        weight.num
      } lbs./${weight.num / 2.2} kgs)! You've contributed ${
        user.values.fatYoshiWeightContributed
      } lbs./${
        user.values.fatYoshiWeightContributed / 2.2
      } kgs! Thanks for keeping me fat! ${EMOTE_FAT_YOSHI}`;
    }
  }
};
