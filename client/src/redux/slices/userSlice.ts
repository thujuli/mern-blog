import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ICurrentUser, IErrMsg, IIsLoading } from "../../types/authType";
import { IUserResponse } from "../../types/userType";

interface IInitialState {
  currentUser: ICurrentUser;
  isLoading: IIsLoading;
  errMsg: IErrMsg;
}

const initialState: IInitialState = {
  currentUser: null,
  isLoading: false,
  errMsg: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userUpdateStart: (state) => {
      state.isLoading = true;
      state.errMsg = null;
    },
    userUpdateSuccess: (state, action: PayloadAction<IUserResponse>) => {
      state.isLoading = false;
      state.errMsg = null;
      state.currentUser = action.payload;
    },
    userUpdateFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errMsg = action.payload;
    },
  },
});

export const { userUpdateFailure, userUpdateStart, userUpdateSuccess } =
  userSlice.actions;
export default userSlice.reducer;
