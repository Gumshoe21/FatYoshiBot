//import { incrementUserValue } from './actions'
import { STREAMER_NICKNAME } from './../constants'
import generatePeterSentence from './utils/generatePeterSentence'
import generateGaslightSentence from './utils/generateGaslightSentence'
// import { generatePublicCommandsList } from './utils/generatePublicCommandsList'

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
}

const generatePublicCommandsList = ({ commands }) => {
  let publicCommandsList: string[] = []
  for (const command in commands) {
    if (!commands[command].access.includes('admin')) publicCommandsList.push(`!${command}`)
  }
  return publicCommandsList.join(' ')
}

const commandsList = generatePublicCommandsList({ commands })
