import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserResponse } from "../../types/userType";
import {
  ICurrentUser,
  IErrMsg,
  IIsLoading,
  ISuccessMsg,
} from "../../types/authType";

interface IInitialState {
  currentUser: ICurrentUser;
  errMsg: IErrMsg;
  isLoading: IIsLoading;
  successMsg: ISuccessMsg;
}

const initialState: IInitialState = {
  currentUser: null,
  errMsg: null,
  isLoading: false,
  successMsg: null,
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
    authReset: (state) => {
      state.isLoading = false;
      state.errMsg = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errMsg = action.payload;
    },
    userUpdateStart: (state) => {
      state.isLoading = true;
      state.errMsg = null;
      state.successMsg = null;
    },
    userUpdateSuccess: (
      state,
      action: PayloadAction<{ message: string; user: ICurrentUser }>
    ) => {
      state.isLoading = false;
      state.currentUser = action.payload.user;
      state.successMsg = action.payload.message;
    },
    userUpdateFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errMsg = action.payload;
    },
    userUpdateReset: (state) => {
      state.errMsg = null;
      state.isLoading = false;
      state.successMsg = null;
    },
  },
});

export const {
  authStart,
  authFailure,
  authReset,
  loginSuccess,
  userUpdateFailure,
  userUpdateReset,
  userUpdateStart,
  userUpdateSuccess,
} = userSlice.actions;
export default userSlice.reducer;
