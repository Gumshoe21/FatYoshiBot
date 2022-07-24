const mongoose = require('mongoose');

const value = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  num: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model('Value', value);
