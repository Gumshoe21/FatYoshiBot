import tmiClient from "./tmiClient.js";
import { commands } from "./commands.js";
import { rewards } from "./rewards.js";
import isOnCooldown from "./utils/isOnCooldown.js";
import { isCommand } from "./../helpers/isCommand.js";
import { setAsyncInterval } from "./../helpers/setAsyncInterval.js";
import { FAT_YOSHI_TIMER_INTERVAL } from "./../constants.js";
import { Client, ChatUserstate } from "tmi.js";
import commandRegexp from "./../helpers/commandRegexp.js";
import dotenv from "dotenv";
import fetch, { Headers } from "node-fetch";
import { getUserId, timeoutUser } from "./../utils/twitchApi.js";

dotenv.config();
export async function commandHandler(
  this: Client,
  channel,
  context,
  message,
  self,
) {
  try {
    if (!isCommand(message)) return;

    // If the user is the bot itself, exit fn.
    if (self) return;

    // Separate the raw message, the command itself, and any args into variables.
    const [raw, command, argument] = message.match(commandRegexp);

    // Obtain the onCommand fn from the command to which it belongs.
    const { onCommand } = commands[command] || {};

    if (!commands[command]) return;

    let response = await onCommand(channel, context, message, self);

    // Execute the isOnCooldown fn and await its response, which will be either true if there is an active cooldown or false if there isn't one.
    const cooldownIsActive = await isOnCooldown(context.username, command);

    if (typeof response !== "string") {
      if (response["timeout"] === true) {
        await this.say(channel, response!["say"]);

        const { userId: botUserId } = await getUserId(this.getUsername());

        const channelId = context!["room-id"];
        const moderatorId = context!["room-id"];
        const userId = context!["user-id"];
        const { duration, reason } = response;

        const { data } = await timeoutUser(
          channelId,
          botUserId,
          userId,
          duration,
          reason,
        );

        console.log(data);
      }
    }

    if (typeof response === "string") {
      if (!cooldownIsActive) {
        this.say(channel, response);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

export async function rewardHandler(
  channel: string,
  username: string,
  type: string,
  tags: ChatUserstate,
): Promise<void> {
  if (!rewards[type]) return;
  // Obtain the onReward fn from the reward to which it belongs.
  const { onReward } = rewards[type] || {};

  // Execute the onReward fn, await its response, and store it in a var.
  let response = await onReward({ channel, username, type, tags });

  tmiClient.say(channel, response);
}

export const raidHandler = async (
  raidedChannel,
  raiderUsername,
  raidViewerCount,
) => {
  tmiClient.say(
    raidedChannel,
    `${raiderUsername} is raiding your channel with ${raidViewerCount} delicious viewers! Dinner is served!`,
  );
};
