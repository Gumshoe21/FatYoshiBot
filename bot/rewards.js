const Value = require('./../models/Value');
const { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } = require('./../constants');

exports.rewards = {
  [`${REWARD_FEED_FAT_YOSHI}`]: {
    onCommand: async ({ userName }) => {
      let weight = await Value.findOneAndUpdate(
        { name: 'fatYoshiWeight' },
        { $inc: { num: 1.0 } },
        { new: true, upsert: true }
      );
      return `${EMOTE_FAT_YOSHI} Thank you for the meal, ${userName}! I now weigh ${
        weight.num
      } pounds (that's ${
        weight.num / 2.2
      } kilograms)! I'm a beeg boi. ${EMOTE_FAT_YOSHI}`;
    }
  }
};
