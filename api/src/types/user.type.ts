interface IUser {
  username: string;
  email: string;
  password: string;
  profilePicture: string;
  isAdmin: boolean;
}

interface UserRequest {
  username: string | null;
  email: string | null;
  profilePicture: string | null;
  password: string | null;
}

interface UserResponse {
  username?: string;
  email?: string;
  profilePicture?: string;
  password?: string;
}

export type { IUser, UserResponse, UserRequest };
