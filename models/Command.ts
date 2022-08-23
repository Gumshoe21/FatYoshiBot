import mongoose from 'mongoose';

interface ICommand {
  name: string;
}

const command = new mongoose.Schema<ICommand>({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const Command = mongoose.model<ICommand>('Command', command);

module.exports = Command;
