import axios, { AxiosRequestConfig } from "axios";
import { PostForm } from "../types/postType";

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

const postIndex = async (paramUserId: string) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/posts?userId=${paramUserId}`
  );
  return res.data;
};

export { postCreate, postIndex };
