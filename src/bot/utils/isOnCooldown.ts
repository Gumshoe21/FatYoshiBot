import Cooldown from '../../models/Cooldown.js'
import convertMsToSec from './../../helpers/convertMsToSec.js'
import getCurrentTimeInMs from './../../helpers/getCurrentTimeInMs.js'
import { GLOBAL_COOLDOWN_TIME_IN_SECONDS } from './../../constants.js'

export default async function isOnCooldown(username: string, command: string) {
	console.log(username)
	// Try to find a cooldown with the provided username and command name in the database. If such a cooldown isn't found, create a new cooldown with the provided username and command name and set the startTime field to the current time in milliseconds.
	try {
		let cooldown = await Cooldown.findOne({
			username: username.toLowerCase(),
			command: command
		})

		if (!cooldown) {
			cooldown = await Cooldown.create({
				username: username.toLowerCase(),
				command,
				startTime: new Date(Date.now()).getTime()
			})
		}
		//
		console.log(Math.floor(cooldown.startTime / 1000))
		// Store the current time in milliseconds in a variable.
		const now = new Date(Date.now()).getTime()

		console.log(Math.floor(new Date(Date.now()).getTime() / 1000))
		// if the current time is not equal to the cooldown's startTime, and if 30 seconds hasn't passed since the cooldown's startTime, return true, indicated that there is an active cooldown. Otherwise, delete the current cooldown, as it has expired, and return false, indicating that there is no active cooldown.
		if (
			convertMsToSec(getCurrentTimeInMs()) !== convertMsToSec(cooldown.startTime) &&
			convertMsToSec(getCurrentTimeInMs()) - convertMsToSec(cooldown.startTime) < 30
		) {
			return true
		} else {
			await Cooldown.deleteOne({ username: username, command: command })
			cooldown = await Cooldown.create({
				username,
				command,
				startTime: new Date(Date.now()).getTime()
			})
			return false
		}
	} catch (err) {
		console.log(err)
	}
}
