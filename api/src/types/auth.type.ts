interface IAuthRegistration {
  username: string;
  email: string;
  password: string;
}

interface IAuthLogin {
  email: string;
  password: string;
}

interface IAuthGoogle {
  displayName: string;
  email: string;
  photoURL: string;
}

export type { IAuthGoogle, IAuthLogin, IAuthRegistration };
