const mongoose = require('mongoose');

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  values: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
    default: {
      fatYoshiWeightContributed: 0
    }
  },
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

user.methods.isAdmin = () => this.access === 'admin';

user.methods.addValue = async function (id, num) {
  this.values.push({ id, num });
};

user.methods.addString = async function (id, text) {
  this.strings.push({ id, text });
};
const User = mongoose.model('User', user);

module.exports = User;
