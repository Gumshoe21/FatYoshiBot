const User = require('./../models/User');
const Command = require('./../models/Command');
const Value = require('./../models/Value');
const Quotes = require('./../models/Quotes');
const { incrementUserValue } = require('./actions')

const commands = {
  r: {
    access: ['public'],
    onCommand: () => {
      return 'Please reset, Gumshoe.'
    }
  },
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


const generatePublicCommandsList = () => {
  let publicCommandsList = [];
  Object.keys(commands).forEach((command) => {
    if (!command.access.includes('admin')) publicCommandsList.push(`!${command}`);
  });
  return publicCommandsList;
};

exports.commands = commands;
exports.generatePublicCommandsList = generatePublicCommandsList;
