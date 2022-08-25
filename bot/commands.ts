const User = require('./../models/User');
const Command = require('./../models/Command');
const Value = require('./../models/Value');
const Quotes = require('../models/Quote');
const { incrementUserValue } = require('./actions');
const { STREAMER_NICKNAME } = require('./../constants');
const { generatePeterSentence } = require('./utils/generatePeterSentence');
// const { generatePublicCommandsList } = require('./utils/generatePublicCommandsList');

const commands = {
  r: {
    access: ['user'],
    onCommand: async () => {
      return `Please reset, ${STREAMER_NICKNAME}.`;
    }
  },
  c: {
    access: ['user'],
    onCommand: async () => {
      return `Please continue, ${STREAMER_NICKNAME}.`;
    }
  },
  bot: {
    access: ['admin'],
    onCommand: async () => {}
  },
  commands: {
    access: ['user'],
    onCommand: async () => {
      return commandsList;
    }
  },
  peter: {
    access: ['user'],
    onCommand: async () => {
      return generatePeterSentence();
    }
  }
};

exports.commands = commands;

const generatePublicCommandsList = ({ commands }) => {
  let publicCommandsList = [];
  for (const command in commands) {
    if (!commands[command].access.includes('admin'))
      publicCommandsList.push(`!${command}`);
  }
  return publicCommandsList.join(' ');
};

const commandsList = generatePublicCommandsList({ commands });
