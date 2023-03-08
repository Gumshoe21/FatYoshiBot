import tmi from 'tmi.js'
import dotenv from 'dotenv'
dotenv.config()
const options: tmi.Options = {
  connection: {
    reconnect: true,
  },
  identity: {
    username: process.env.TWITCH_BOT_USERNAME,
    password: process.env.TWITCH_BOT_OAUTH_TOKEN,
  },
  channels: ['gumshoe21'],
  /*
  options: {
    debug: true,
  },
  */
}

const tmiClient = new tmi.Client(options)

export default tmiClient
