import { IUserResponse } from "./userType";

interface IGoogleResponse {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

type ICurrentUser = IUserResponse | null;
type IErrMsg = string | null;
type ISuccessMsg = string | null;
type IIsLoading = boolean;

export type { IGoogleResponse, ICurrentUser, IErrMsg, IIsLoading, ISuccessMsg };
