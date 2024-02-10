interface UserForm {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  profilePicture?: string;
}

interface UserResponse {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
  access_token?: string;
}

export type { UserForm, UserResponse };
