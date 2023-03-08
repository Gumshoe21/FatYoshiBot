import dotenv from 'dotenv'
import mongoose from 'mongoose'
import tmiClient from './bot/tmiClient.js'
import { commandHandler, rewardHandler, raidHandler } from './bot/handlers.js'
import Value from './models/Value'
import app from './app.js'

dotenv.config()

mongoose.connect(process.env.MONGO_URI || '').then((_con) => console.log('Database connection successful.'))
  await tmiClient.connect()
tmiClient.on('message', commandHandler)
tmiClient.on('redeem', rewardHandler)
tmiClient.on('raided', raidHandler)

process.on('uncaughtException', (err) => {
  console.log(err)
  process.exit(1) // code 0 = success; code 1 = uncaught exception
})

const port = process.env.PORT || 8000
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
