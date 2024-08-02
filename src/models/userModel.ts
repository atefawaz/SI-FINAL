import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  messages: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

const User = mongoose.model<IUser>('User', userSchema);
export default User;
