import mongoose from 'mongoose';

interface ICooldown {
  username: string;
  command: string;
  startTime: number;
}

const cooldown = new mongoose.Schema<ICooldown>({
  username: {
    type: String,
    required: true,
    sparse: false
  },
  command: {
    type: String,
    required: true
  },
  startTime: {
    type: Number,
    required: true
  }
});

const Cooldown = mongoose.model<ICooldown>('Cooldown', cooldown);

export default  Cooldown;
