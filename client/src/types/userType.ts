interface UserForm {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
  access_token?: string;
}

interface UserResponse {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  access_token?: string;
}

export type { UserForm, UserResponse };
