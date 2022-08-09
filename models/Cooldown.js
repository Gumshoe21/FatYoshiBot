const mongoose = require('mongoose');

const cooldown = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  command: {
    type: String,
    required: true
  },
  length: {
    type: Date,
    required: String
  }
});

const Cooldown = mongoose.model('Cooldown', cooldown);
module.exports = Cooldown;
