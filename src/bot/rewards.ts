import { ValueDeterminingMiddleware } from 'express-rate-limit'
import mongoose from 'mongoose'

import Value from './../models/Value.js'
import User from './../models/User.js'
// import { incrementUserValue } from './actions'
import { REWARD_FEED_FAT_YOSHI, EMOTE_FAT_YOSHI } from './../constants.js'

export const rewards = {
  [`${REWARD_FEED_FAT_YOSHI}`]: {
    onReward: async ({ username, channel, type, tags }) => {
      const user = await User.findOneAndUpdate(
        { username },
        {
          $inc: { [`fatYoshiWeightContributed`]: Math.floor(1) },
        },
        {
          upsert: true,
          new: true,
        }
      )

      const fatYoshiWeight = await Value.findOneAndUpdate(
        { name: 'fatYoshiWeight' },
        {
          $inc: { [`num`]: Math.floor(1) },
        },
        {
          upsert: true,
          new: true,
        }
      )

      const { num: weight } = fatYoshiWeight
      const { fatYoshiWeightContributed: contributed } = user
      return `${EMOTE_FAT_YOSHI} Thanks for feeding me, ${username}! I now weigh ${weight} lbs./${(weight / 2.2).toFixed(
        2
      )} kgs)! You've contributed ${contributed} lbs./${(contributed / 2.2).toFixed(2)} kgs! Thanks for keeping me fat! ${EMOTE_FAT_YOSHI}`
    },
  },
}
