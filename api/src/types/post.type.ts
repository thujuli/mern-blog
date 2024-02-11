import { Document } from "mongoose";

interface IPost extends Document {
  userId: string;
  title: string;
  category: string;
  imageUrl: string;
  content: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface PostRequest {
  title: string | null;
  category: string | null;
  imageUrl: string | null;
  content: string | null;
}

interface PostFields {
  title?: string;
  category?: string;
  imageUrl?: string;
  content?: string;
}

export type { IPost, PostRequest, PostFields };
