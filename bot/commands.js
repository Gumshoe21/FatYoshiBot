const User = require('./../models/User');
const Command = require('./../models/Command');

const Value = require('./../models/Value');

const Quotes = require('./../models/Quotes');

exports.commands = {
  feed: {
    onCommand: async () => {
      let weight = await Value.findOneAndUpdate(
        { name: 'fatYoshiWeight' },
        { $inc: { num: 1.0 } },
        { new: true, upsert: true }
      );
      return `${weight.num} beegboyu!!!!!`;
    }
  }
};
