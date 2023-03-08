import { STREAMER_NICKNAME } from './../constants.js'
import generatePeterSentence from './utils/generatePeterSentence.js'
import generateGaslightSentence from './utils/generateGaslightSentence.js'
import mongoose from 'mongoose'
import Value from './../models/Value.js'
import User from './../models/User.js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

import { ChatUserstate } from 'tmi.js'
interface ICommands {
  [key: string]: {
    access: string[]
    onCommand: (channel?: string, context?: ChatUserstate, message?: string, self?: boolean) => Promise<string>
  }
}

export const commands: ICommands = {
  r: {
    access: ['user'],
    onCommand: async () => {
      return `Please reset, ${STREAMER_NICKNAME}.`
    },
  },
  c: {
    access: ['user'],
    onCommand: async () => {
      return `Please continue, ${STREAMER_NICKNAME}.`
    },
  },
  bot: {
    access: ['user'],
    onCommand: async () => {
      return "Hi there! I'm FatYoshiBot. Gumshoe programmed me to entertain you during the stream. If you have any ideas about new features I should have, let Gumshoe know! It would be a beeg help."
    },
  },
  commands: {
    access: ['user'],
    onCommand: async () => {
      return commandsList
    },
  },
  peter: {
    access: ['user'],
    onCommand: async () => {
      return generatePeterSentence()
    },
  },
  gaslight: {
    access: ['user'],
    onCommand: async () => {
      return generateGaslightSentence()
    },
  },
  weight: {
    access: ['user'],
    onCommand: async () => {
      const fatYoshiWeight = await Value.findOne({ name: 'fatYoshiWeight' })
      const { num: weight } = fatYoshiWeight!
      return `My weight is ${weight} lbs./${(weight / 2.2).toFixed(2)} kgs.`
    },
  },
  feeders: {
    access: ['user'],
    onCommand: async () => {
      const top5Feeders = await User.aggregate([
        { $sort: { fatYoshiWeightContributed: -1 } },
        { $limit: 5 },
        { $project: { username: 1, fatYoshiWeightContributed: 1 } },
      ])

      let returnStr = `Here are my top 5 feeders:\n`
      for (let i = 0; i < top5Feeders.length; i++) {
        returnStr += `(${i + 1}) ${top5Feeders[i].username} - ${top5Feeders[i].fatYoshiWeightContributed} lbs./${(
          top5Feeders[i].fatYoshiWeightContributed / 2.2
        ).toFixed(2)} kgs.\n`
      }
      returnStr += `I'm so blessed to be fed so often!~~`
      console.log(returnStr)
      return returnStr
    },
  },
  age: {
    access: ['user'],
    onCommand: async (channel, context, message, self) => {
      const userId = context!['user-id']
      const channelId = context!['room-id']

      const res = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&from_id=${userId}`, {
        headers: {
          'Client-ID': process.env.TWITCH_APP_CLIENT_ID,
          Authorization: `Bearer ${process.env.TWITCH_BOT_OAUTH_TOKEN!.split(':')[1]}`,
        },
      })
      let data = await res.json()
      let { data: dataObj } = data
      console.log(data.data[0].followed_at)

      if (data) {
        const followDate = new Date(data.data[0].followed_at)
        const currentDate = new Date()
        const followAge = Math.floor((currentDate.getTime() - followDate.getTime()) / (1000 * 60 * 60 * 24))
        return `@${context!['username']}'s follow age is ${followAge} days`
      } else {
        return "Sorry, I don't have any data on this, I ate it all"
      }
    },
  },
}

const generatePublicCommandsList = ({ commands }) => {
  let publicCommandsList: string[] = []
  for (const command in commands) {
    if (commands[command].access && !commands[command].access.includes('admin')) publicCommandsList.push(`!${command}`)
  }
  return publicCommandsList.join(' ')
}

const commandsList = generatePublicCommandsList({ commands })
