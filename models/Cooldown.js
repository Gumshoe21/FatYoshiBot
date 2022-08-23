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
    type: Number,
    required: true
  }
});

const Cooldown = mongoose.model('Cooldown', cooldown);

module.exports = Cooldown;
