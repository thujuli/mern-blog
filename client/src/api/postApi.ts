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

export { postCreate };
