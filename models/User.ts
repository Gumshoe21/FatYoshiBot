import mongoose from 'mongoose';

interface IUser {
  username: string;
  values: mongoose.Schema.Types.Mixed;
  strings: { id: number; text: string }[];
  access: string;
  roles: string[];
}

const user = new mongoose.Schema<IUser>({
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
  roles: [String]
});

const User = mongoose.model<IUser>('User', user);

module.exports = User;
