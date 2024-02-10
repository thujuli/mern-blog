interface AuthRegistration {
  username: string | null;
  email: string | null;
  password: string | null;
}

interface AuthLogin {
  email: string | null;
  password: string | null;
}

interface AuthGoogle {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export type { AuthGoogle, AuthLogin, AuthRegistration };
