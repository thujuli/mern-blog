interface IUserForm {
  username: string;
  email: string;
  password: string;
  profilePicture?: string;
}

interface IUserResponse {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type { IUserForm, IUserResponse };
