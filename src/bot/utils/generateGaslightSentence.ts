export default function generateGaslightSentence() {
	const sentences = [
		"It's all in your head.",
		'That never happened.',
		'I never said that.',
		"You're overreacting.",
		"You're so emotional.",
		'You need help.',
		"You're imagining things.",
		"You're the only person who has a problem with me.",
		'Stop being so sensitive.',
		'It was just a joke.',
		'You deserved it.',
		"You're just being paranoid"
	]

	return sentences[Math.floor(Math.random() * sentences.length)]
}
