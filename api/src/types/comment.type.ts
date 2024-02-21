import { Document } from "mongoose";

interface IComment extends Document {
  content: string;
  postId: string;
  userId: string;
  likes: string[];
  numberOfLikes: number;
  createdAt: Date;
  updated: Date;
}

export { IComment };
