import mongoose, { Document, Schema } from 'mongoose';

interface IComment extends Document {
  movie_id: number;
  username: string;
  comment: string;
  title: string;
  rating: number;
  downvotes: number;
  upvotes: number;
  created_at: Date;
}

const commentSchema: Schema = new Schema(
  {
    movie_id: {
      type: Number,
      required: [true, 'movie is required'],
    },
    username: {
      type: String,
      required: [true, 'username is required'],
    },
    comment: {
      type: String,
      required: [true, 'comment is required'],
    },
    title: {
      type: String,
      required: [true, 'title is required'],
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: [true, 'rating is required'],
    },
    downvotes: {
      type: Number,
      min: 0,
      default: 0,
    },
    upvotes: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
    },
  }
);

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;
