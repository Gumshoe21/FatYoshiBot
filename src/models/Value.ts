import mongoose from 'mongoose';

interface IValue {
  name: string;
  num: number;
}

const value = new mongoose.Schema<IValue>({
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

const Value = mongoose.model<IValue>('Value', value);

export default Value;
