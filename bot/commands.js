const User = require('./../models/User');
const Command = require('./../models/Command');

const Value = require('./../models/Value');

const Quotes = require('./../models/Quotes');

const generatePublicCommandsList = () => {
  let publicCommandsList = [];
  Object.keys(commands).forEach((command) => {
    if (!command.access.includes('admin')) publicCommandsList.push(`!${command}`);
  });
  return commands;
};

exports.commands = {
  bot: {
    access: ['admin'],
    onCommand: async () => { }
  },
  commands: {
    access: ['user'],
    onCommand: async () => {
      return generatePublicCommandsList();
    }
  }
};
