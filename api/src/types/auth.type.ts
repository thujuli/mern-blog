interface AuthRegistration {
  username: string;
  email: string;
  password: string;
}

interface AuthLogin {
  email: string;
  password: string;
}

interface AuthGoogle {
  displayName: string;
  email: string;
  photoURL: string;
}

export type { AuthGoogle, AuthLogin, AuthRegistration };
