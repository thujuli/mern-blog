import { Document } from "mongoose";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserRequest {
  username: string | null;
  email: string | null;
  profilePicture: string | null;
  password: string | null;
}

interface UserFields {
  username?: string;
  email?: string;
  profilePicture?: string;
  password?: string;
}

export type { IUser, UserFields, UserRequest };
