const mongoose = require('mongoose');

const cooldown = mongoose.Schema({
  username: {
    type: String,
    required: true,
    sparse: false
  },
  command: {
    type: String,
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  }
});

const Cooldown = mongoose.model('Cooldown', cooldown);
module.exports = Cooldown;
