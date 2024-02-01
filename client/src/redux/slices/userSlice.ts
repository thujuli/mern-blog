import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserResponse } from "../../types/userType";

interface IInitialState {
  currentUser: IUserResponse | null;
  errMsg: string | null;
  isLoading: boolean;
}

const initialState: IInitialState = {
  currentUser: null,
  errMsg: null,
  isLoading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.errMsg = null;
    },
    loginSuccess: (state, action: PayloadAction<IUserResponse>) => {
      state.isLoading = false;
      state.errMsg = null;
      state.currentUser = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.errMsg = action.payload;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure } = userSlice.actions;
export default userSlice.reducer;
