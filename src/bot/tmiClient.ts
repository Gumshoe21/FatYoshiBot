import * as fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import tmi, { Client } from 'tmi.js'

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

const tmiClient: Client = new tmi.Client(options)

export default tmiClient
