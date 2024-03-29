import { UserData } from "./userType";

interface GoogleResponse {
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

type CurrentUser = UserData | null;
type ErrMsg = string | null;
type SuccessMsg = string | null;
type IsLoading = boolean;

export type { GoogleResponse, CurrentUser, ErrMsg, IsLoading, SuccessMsg };
