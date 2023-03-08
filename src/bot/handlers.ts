import tmiClient from './tmiClient.js'
import { commands } from './commands.js'
import { rewards } from './rewards.js'
import { isOnCooldown } from './utils/isOnCooldown.js'
import { isCommand } from './../helpers/isCommand.js'
import { setAsyncInterval } from './../helpers/setAsyncInterval.js'
import { FAT_YOSHI_TIMER_INTERVAL } from './../constants.js'
import { ChatUserstate } from 'tmi.js'

export async function commandHandler(channel, context, message, self) {
  if (!isCommand(message)) return

  // If the user is the bot itself, exit fn.
  if (self) return

  const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/)
  // Separate the raw message, the command itself, and any args into variables.
  const [raw, command, argument] = message.match(regexpCommand)

  // Obtain the onCommand fn from the command to which it belongs.
  const { onCommand } = commands[command] || {}

  if (!commands[command]) return

  let response = await onCommand({ channel, context, message, self })

  // Execute the isOnCooldown fn and await its response, which will be either true if there is an active cooldown or false if there isn't one.
  const cooldownIsActive = await isOnCooldown(context.username, command)

  // If there isn't an active cooldown, convey the response to the channel in a message.
  if (!cooldownIsActive) tmiClient.say(channel, response)
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
