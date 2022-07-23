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
  roles: [
    {
      type: String,
      enum: ['user', 'mod', 'vip', 'admin'],
      required: true,
      unique: true
    }
  ]
});

userSchema.methods.isAdmin = () => this.access === 'admin';

userSchema.methods.addValue = async function (id, num) {
  this.values.push({ id, num });
};

userSchema.methods.addString = async function (id, text) {
  this.strings.push({ id, text });
};
const User = mongoose.model('User', user);
