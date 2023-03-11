import { STREAMER_NICKNAME } from './../constants.js'
import generatePeterSentence from './utils/generatePeterSentence.js'
import generateGaslightSentence from './utils/generateGaslightSentence.js'
import mongoose from 'mongoose'
import Value from './../models/Value.js'
import User from './../models/User.js'
import fetch from 'node-fetch'
import dotenv from 'dotenv'
import tmiClient from './tmiClient.js'
import commandRegexp from './../helpers/commandRegexp.js'
import { getUserId, getFollowAge } from './../utils/twitchApi.js'

dotenv.config()

import { ChatUserstate } from 'tmi.js'
interface ICommands {
  [key: string]: {
    access: string[]
    onCommand: (
      channel?: string,
      context?: ChatUserstate,
      message?: string,
      self?: boolean
    ) => Promise<string | { say: string; timeout: boolean; reason: string; duration: number }>
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
      // Declare userId as undefined at function's top level to allow access for nested functions.
      let followerId = undefined
      const channelId = context!['room-id']

      const match = message!.match(commandRegexp)
      if (!match) return 'No match.'

      const [raw, command, argument] = match!

      if (argument) {
        let { userId: fetchedId } = await getUserId(argument)

        followerId = fetchedId || context!['user-id']
      }

      let say = await getFollowAge(channelId, followerId, context!['user-id'])
      return say
    },
  },
  roulette: {
    access: ['user'],
    onCommand: async (channel, context, message, self) => {
      console.log(channel)
      console.log(context)
      let val = Math.random()
      let username = context!['display-name']
      if (val === 0) {
        return `${username} survived! For now...`
      } else {
        return {
          say: `My rapid-fire egg killed ${username}. Begone heathen!`,
          timeout: true,
          reason: "You're dead, get rekt.",
          duration: 60,
        }
      }
    },
  },
  nerd: {
    access: ['user'],
    onCommand: async (channel, context, message, self) => {
      const match = message!.match(commandRegexp)
      const [raw, command, argument] = match!
      if (!argument) {
        return 'Nerdge UHM ACKSHYUALLY YOU NEED TO PROVIDE AN ARGUMENT TO THE COMMAND SO THAT THE COMMAND CAN EXECUTE PROPERLY. *pushes up bridge of glasses* UHM Nerdge'
      }
      console.log(raw, command, argument)
      return `Nerdge UHM ACKSHYUALLY ${argument.toUpperCase()} *pushes up bridge of glasses* UHM Nerdge`
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
