import mongoose from 'mongoose'

interface IUser {
  username: string
  fatYoshiWeightContributed: number
  strings: { id: number; text: string }[]
  access: string
  roles: string[]
  correctPassword?: string
  password?: string
}

const user = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  fatYoshiWeightContributed: {
    type: Number,
    required: true,
    default: 0,
  },
  strings: [
    {
      id: Number,
      text: String,
    },
  ],
  access: {
    type: String,
    required: true,
    default: 'user',
  },
  roles: [String],
})

const User = mongoose.model<IUser>('User', user)
export default User
