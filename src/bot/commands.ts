import { STREAMER_NICKNAME } from './../constants.js'
import generatePeterSentence from './utils/generatePeterSentence.js'
import generateGaslightSentence from './utils/generateGaslightSentence.js'
import mongoose from 'mongoose'
import Value from './../models/Value.js'
import User from './../models/User.js'

export const commands = {
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
    accesss: ['user'],
    onCommand: async () => {
      const top5Feeders = await User.aggregate([
        { $sort: { fatYoshiWeightContributed: -1 } },
        { $limit: 5 },
        { $project: { username: 1, fatYoshiWeightContributed: 1 } },
      ])

      let returnStr = `Here are my top 5 feeders:\n`
      for (let i = 0; i < top5Feeders.length; i++) {
        returnStr += `${i + 1}. ${top5Feeders[i].username} - ${top5Feeders[i].fatYoshiWeightContributed} lbs./${(
          top5Feeders[i].fatYoshiWeightContributed / 2.2
        ).toFixed(2)} kgs.\n`
      }
      returnStr += `I'm so blessed to be fed so often!~~`
      console.log(returnStr)
      return returnStr
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
