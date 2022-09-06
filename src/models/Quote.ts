import mongoose from 'mongoose';

interface IQuote {
  id: number;
  category: string;
  text: string;
}
const quote = new mongoose.Schema<IQuote>({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    unique: false,
    default: 'quote'
  },
  text: {
    type: String,
    required: true,
    unique: true
  }
});

const Quote = mongoose.model<IQuote>('Quote', quote);

module.exports = Quote;
