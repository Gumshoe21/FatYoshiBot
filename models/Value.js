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

const Value = mongoose.model('Value', value);

module.exports = Value;
