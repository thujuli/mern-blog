import axios, { AxiosRequestConfig } from "axios";
import { PostForm, PostParams } from "../types/postType";

const config: AxiosRequestConfig = {
  withCredentials: true,
};

const postCreate = async (data: PostForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/posts`,
    data,
    config
  );
  return res.data;
};

const postIndex = async (params: PostParams) => {
  const queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/posts?${queryParams}`
  );
  return res.data;
};

const postDestroy = async (postId: string) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/posts/${postId}`,
    config
  );
  return res.data;
};

export { postCreate, postIndex, postDestroy };
