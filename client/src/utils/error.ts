import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { useDispatch } from "react-redux";

type AppDispatch = ReturnType<typeof useDispatch>;

const handleDispatchError = (
  error: unknown,
  dispatch: AppDispatch,
  actionCreator: (payload: string) => PayloadAction<string>
) => {
  const err = error as Error | AxiosError;
  if (axios.isAxiosError(err)) {
    dispatch(actionCreator(err.response?.data.message));
  } else {
    dispatch(actionCreator(err.message ?? "An unknown error occured"));
  }
};

export { handleDispatchError };
