import axios from "axios";
import { CommentForm } from "../types/commentType";

axios.defaults.withCredentials = true;

const commentCreate = async (data: CommentForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/comments`,
    data
  );
  return res.data;
};

const commentLike = async (commentId: string) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}/like`
  );
  return res.data;
};

export { commentCreate, commentLike };
