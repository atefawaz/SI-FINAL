import mongoose, { Document, Schema } from 'mongoose';

interface IMessage extends Document {
  name: string;
  user: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const messageSchema: Schema = new Schema(
  {
    name: String,
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);
export default Message;
