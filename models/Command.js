const mongoose = require('mongoose');

const command = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  values: [
    {
      id: String,
      total: Number
    }
  ],
  strings: [
    {
      id: Number,
      text: String
    }
  ]
});

const Command = mongoose.model('Command', command);
