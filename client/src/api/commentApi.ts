import axios, { AxiosRequestConfig } from "axios";
import { CommentForm } from "../types/commentType";

const config: AxiosRequestConfig = {
  withCredentials: true,
};

const commentCreate = async (data: CommentForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/comments`,
    data,
    config
  );
  return res.data;
};

const commentIndex = async (postId: string) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/comments/${postId}`
  );
  return res.data;
};

export { commentCreate, commentIndex };
