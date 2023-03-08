export default function generatePeterSentence() {
	const wordGroups = [
		["Don't", 'worry', 'Mr.', 'Aziz', 'these', 'pizzas', 'are', 'in', 'good', 'hands'],
		[
			'Oh',
			'no',
			'Dr.',
			"Conners'",
			'class',
			'I',
			'got',
			'so',
			'caught',
			'up',
			'in',
			'what',
			'I',
			'was',
			'doing',
			'I',
			'forgot',
			'all',
			'about',
			'it',
			"S'gonna",
			'kill',
			'me'
		]
	]

	const groupCount = wordGroups.length
	const randomGroup = wordGroups[Math.floor(Math.random() * groupCount)]

	for (let i = randomGroup.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1))
		;[randomGroup[i], randomGroup[j]] = [randomGroup[j], randomGroup[i]]
	}
	return randomGroup.join(' ')
}
