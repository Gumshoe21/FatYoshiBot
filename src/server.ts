import dotenv from 'dotenv'
import mongoose from 'mongoose'
import tmiClient from './bot/tmiClient.js'
import { commandHandler, rewardHandler, raidHandler } from './bot/handlers.js'
import app from './app.js'
import WebSocket from 'ws'
dotenv.config()

mongoose.connect(process.env.MONGO_URI || '').then((_con) => console.log('Database connection successful.'))

const tauSocketUrl = `ws://localhost:${process.env.TAU_PORT}/ws/twitch-events/`
console.log('TAU Socket URL:', tauSocketUrl)

const ws = new WebSocket(tauSocketUrl)

ws.on('open', () => {
  console.log('Socket Open:', tauSocketUrl)

  ws.send(JSON.stringify({ token: process.env.TAU_AUTH_TOKEN }))
  console.log("TAU connected and listening for events...")
})

ws.on('message',(data) => {
  const eventData = JSON.parse(data);
  console.log('--- message', eventData)
})
await tmiClient.connect()

tmiClient.on('message', commandHandler)
// tmiClient.on('redeem', rewardHandler)
tmiClient.on('raided', raidHandler)
tmiClient.on('timeout', async (channel, username, duration, reason) => {
  console.log(channel, username, duration, reason)
})

process.on('uncaughtException', (err) => {
  console.log(err)
  process.exit(1) // code 0 = success; code 1 = uncaught exception
})

const port = process.env.PORT || 3000

const server = app.listen(port, () => {})

process.on('unhandledRejection', (err) => {
  console.log(err)
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  server.close(() => {})
})
