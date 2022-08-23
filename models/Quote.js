const mongoose = require('mongoose');

const quote = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  text: {
    type: String,
    required: true,
    unique: true
  }
});

const Quote = mongoose.model('Quote', quote);

module.exports = Quote;
