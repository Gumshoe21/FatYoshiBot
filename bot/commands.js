const User = require('./../models/User');
const Command = require('./../models/Command');
const Value = require('./../models/Value');
const Quotes = require('./../models/Quotes');
const { incrementUserValue } = require('./actions');
const { STREAMER_NICKNAME } = require('./../constants');
const {
  generatePublicCommandsList,
  generatePeterSentence
} = require('./utils');

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
      return generatePublicCommandsList();
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
