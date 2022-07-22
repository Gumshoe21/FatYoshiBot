const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
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
  ],
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
