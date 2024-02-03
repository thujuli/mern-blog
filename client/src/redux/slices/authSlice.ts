import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserResponse } from "../../types/userType";
import { ICurrentUser, IErrMsg, IIsLoading } from "../../types/authType";

interface IInitialState {
  currentUser: ICurrentUser;
  errMsg: IErrMsg;
  isLoading: IIsLoading;
}

const initialState: IInitialState = {
  currentUser: null,
  errMsg: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.isLoading = true;
      state.errMsg = null;
    },
    loginSuccess: (state, action: PayloadAction<IUserResponse>) => {
      state.currentUser = action.payload;
      state.isLoading = false;
      state.errMsg = null;
    },
    authDone: (state) => {
      state.isLoading = false;
      state.errMsg = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errMsg = action.payload;
    },
  },
});

export const { authStart, authFailure, authDone, loginSuccess } =
  userSlice.actions;
export default userSlice.reducer;
