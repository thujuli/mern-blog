import { createSlice } from "@reduxjs/toolkit";

interface IInitialState {
  mode: "light" | "dark";
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
