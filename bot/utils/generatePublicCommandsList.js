exports.generatePublicCommandsList = ({ commands }) => {
  let publicCommandsList = [];
  Object.keys(commands).forEach((command) => {
    if (!command.access.includes('admin'))
      publicCommandsList.push(`!${command}`);
  });
  return publicCommandsList;
};
