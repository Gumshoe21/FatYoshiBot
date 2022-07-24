const mongoose = require('mongoose');

const string = mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true
  },
  command: {
    type: mongoose.Schema.ObjectId,
    ref: 'Command'
  }
});

const String = mongoose.model('String', string);
