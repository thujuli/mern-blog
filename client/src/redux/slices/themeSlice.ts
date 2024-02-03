import { createSlice } from "@reduxjs/toolkit";
import { IMode } from "../../types/themeType";

interface IInitialState {
  mode: IMode;
}

const initialState: IInitialState = {
  mode: "light",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    themeToggle: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
  },
});

export const { themeToggle } = themeSlice.actions;
export default themeSlice.reducer;
