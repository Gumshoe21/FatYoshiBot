const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  points: {
    type: Number,
    required: true,
    default: 0
  },
  weightContributed: {
    type: Number,
    required: true,
    default: 0
  },
  triviaScore: {
    type: Number,
    required: true,
    default: 0
  },
  access: {
    type: String,
    required: true,
    default: 'user'
  },
  permissions: [
    {
      type: String,
      enum: ['user', 'mod', 'vip', 'admin'],
      required: true,
      unique: true
    }
  ]
});

const User = mongoose.model('User', user);
