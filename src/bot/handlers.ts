import tmiClient from './tmiClient.js'
import { commands } from './commands.js'
import { rewards } from './rewards.js'
import { isOnCooldown } from './utils/isOnCooldown.js'
import { isCommand } from './../helpers/isCommand.js'
import { setAsyncInterval } from './../helpers/setAsyncInterval.js'
import { FAT_YOSHI_TIMER_INTERVAL } from './../constants.js'
import { Client, ChatUserstate } from 'tmi.js'
import commandRegexp from './../helpers/commandRegexp.js'
import dotenv from 'dotenv'
import fetch, { Headers } from 'node-fetch'

dotenv.config()
export async function commandHandler(this: Client, channel, context, message, self) {
  try {
    if (!isCommand(message)) return

    // If the user is the bot itself, exit fn.
    if (self) return

    // Separate the raw message, the command itself, and any args into variables.
    const [raw, command, argument] = message.match(commandRegexp)

    // Obtain the onCommand fn from the command to which it belongs.
    const { onCommand } = commands[command] || {}

    if (!commands[command]) return

    let response = await onCommand(channel, context, message, self)

    // Execute the isOnCooldown fn and await its response, which will be either true if there is an active cooldown or false if there isn't one.
    const cooldownIsActive = await isOnCooldown(context.username, command)

    if (typeof response !== 'string') {
      if (response['timeout'] === true) {
        await this.say(channel, response!['say'])
        //        await tmiClient.timeout(channel, context.username, 60)

        const botHeaders = new Headers()
        botHeaders.set('Client-Id', process.env.TWITCH_APP_CLIENT_ID!)
        botHeaders.set('Authorization', `Bearer ${process.env.TWITCH_BOT_OAUTH_TOKEN!.split(':')[1]}`)

        const botRes = await fetch(`https://api.twitch.tv/helix/users?login=${this.getUsername()}`, {
          method: 'GET',
          headers: botHeaders,
        })
        console.log(this.getUsername())
        const botData = await botRes.json()
        const botUserId = botData.data[0].id
        console.log('BOT DATA', botData)

        const channelId = context!['room-id']
        const moderatorId = context!['room-id']
        const userId = context!['user-id']
        console.log(userId)
        const duration = 60
        const reason = 'Cuz I want to LMAO.'

        const url = `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${channelId}&moderator_id=${botUserId}`
        //        console.log('fatyoshiid', botUserId)
        const headers = new Headers()
        headers.set('Content-Type', 'application/json')
        headers.set('Client-Id', process.env.TWITCH_APP_CLIENT_ID!)
        headers.set('Authorization', `Bearer ${process.env.TWITCH_BOT_OAUTH_TOKEN!.split(':')[1]}`)

        const res = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            data: {
              user_id: context!['user-id'],
              duration,
              reason,
            },
          }),
        })

        const data = await res.json()

        console.log(data)
      }
    }

    // If there isn't an active cooldown, convey the response to the channel in a message.
    if (typeof response === 'string') {
      if (!cooldownIsActive) {
        this.say(channel, response)
      }
    }
  } catch (err) {
    console.log(err)
  }
}

export async function rewardHandler(channel: string, username: string, type: string, tags: ChatUserstate): Promise<void> {
  if (!rewards[type]) return
  // Obtain the onReward fn from the reward to which it belongs.
  const { onReward } = rewards[type] || {}

  // Execute the onReward fn, await its response, and store it in a var.
  let response = await onReward({ channel, username, type, tags })

  tmiClient.say(channel, response)
}

export const raidHandler = async (raidedChannel, raiderUsername, raidViewerCount) => {
  tmiClient.say(raidedChannel, `${raiderUsername} is raiding your channel with ${raidViewerCount} delicious viewers! Dinner is served!`)
}
