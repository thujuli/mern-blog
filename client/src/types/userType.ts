interface UserForm {
  username: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  profilePicture?: string;
}

interface UserData {
  _id: string;
  username: string;
  email: string;
  profilePicture: string;
  isAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UsersResponse {
  users: UserData[];
  totalUsers: number;
  totalLastMonthUsers: number;
}

interface UserParams {
  skip?: number;
  limit?: number;
  sort?: number;
}

export type { UserForm, UserData, UsersResponse, UserParams };
