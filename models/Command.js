const mongoose = require('mongoose');

const command = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Command = mongoose.model('Command', command);

module.exports = Command;
