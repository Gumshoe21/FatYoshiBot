const generatePeterSentence = () => {
  const wordGroups = [
    [
      "Don't",
      'worry',
      'Mr.',
      'Aziz',
      'these',
      'pizzas',
      'are',
      'in',
      'good',
      'hands'
    ], // length 8, array.length - 1 = 7;
    [
      'Oh',
      'no',
      'Dr.',
      "Conners'",
      'class',
      'I',
      'got',
      'so caught up in',
      'what I was doing',
      'I forgot all about',
      'it',
      "S'gonna kill me."
    ]
  ];

  const groupCount = wordGroups.length;
  const randomGroup = wordGroups[Math.floor(Math.random() * groupCount)];

  for (let i = randomGroup.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [randomGroup[i], randomGroup[j]] = [randomGroup[j], randomGroup[i]];
  }
  return randomGroup.join(' ');
};

exports.generatePeterSentence = generatePeterSentence;

const generatePublicCommandsList = ({ commands }) => {
  let publicCommandsList = [];
  Object.keys(commands).forEach((command) => {
    if (!command.access.includes('admin'))
      publicCommandsList.push(`!${command}`);
  });
  return publicCommandsList;
};

exports.generatePublicCommandsList = generatePublicCommandsList;
