import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserResponse } from "../../types/userType";
import {
  CurrentUser,
  ErrMsg,
  IsLoading,
  SuccessMsg,
} from "../../types/authType";

interface InitialState {
  currentUser: CurrentUser;
  errMsg: ErrMsg;
  isLoading: IsLoading;
  successMsg: SuccessMsg;
}

const initialState: InitialState = {
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
    loginSuccess: (state, action: PayloadAction<UserResponse>) => {
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
      action: PayloadAction<{ message: string; user: CurrentUser }>
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
