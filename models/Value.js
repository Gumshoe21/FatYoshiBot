const mongoose = require('mongoose');

const value = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  num: {
    type: Number,
    required: true
  }
});

const Value = mongoose.model('Value', value);
