import fetch, { Headers } from 'node-fetch'

export async function getUserId(username: string) {
  const headers = new Headers()
  headers.set('Client-Id', process.env.TWITCH_APP_CLIENT_ID!)
  headers.set('Authorization', `Bearer ${process.env.TWITCH_BOT_OAUTH_TOKEN!.split(':')[1]}`)

  const res = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
    method: 'GET',
    headers: headers,
  })

  const data = await res.json()
  const userId = data.data[0].id
  return {
    userId,
    data,
  }
}

export async function timeoutUser(broadcasterId, moderatorId, userId, duration, reason) {
  const url = `https://api.twitch.tv/helix/moderation/bans?broadcaster_id=${broadcasterId}&moderator_id=${moderatorId}`

  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Client-Id', process.env.TWITCH_APP_CLIENT_ID!)
  headers.set('Authorization', `Bearer ${process.env.TWITCH_BOT_OAUTH_TOKEN!.split(':')[1]}`)

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      data: {
        user_id: userId,
        duration,
        reason,
      },
    }),
  })

  const data = await res.json()
  return data
}

export async function getFollowAge(channelId, followerId, invokerId) {
  const res = await fetch(`https://api.twitch.tv/helix/users/follows?to_id=${channelId}&from_id=${followerId || invokerId}`, {
    headers: {
      'Client-ID': process.env.TWITCH_APP_CLIENT_ID!,
      Authorization: `Bearer ${process.env.TWITCH_BOT_OAUTH_TOKEN!.split(':')[1]}`,
    },
  })
  console.log(invokerId)
  let data = await res.json()

  if (data.data[0]) {
    const followDate = new Date(data.data[0].followed_at)
    const currentDate = new Date()
    const followAge = Math.floor((currentDate.getTime() - followDate.getTime()) / (1000 * 60 * 60 * 24))
    return `@${data.data[0].from_name || data.data[0].display_name}'s follow age is ${followAge} days`
  } else {
    return "Sorry, I don't have any data on this, I ate it all"
  }
}
