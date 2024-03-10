import axios from "axios";
import { CommentForm, CommentParams } from "../types/commentType";

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

const commentUpdate = async (commentId: string, content: string) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`,
    { content }
  );
  return res.data;
};

const commentDestroy = async (commentId: string) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/comments/${commentId}`
  );
  return res.data;
};

const commentIndex = async (params: CommentParams) => {
  const queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/comments?${queryParams}`
  );
  return res.data;
};

export {
  commentCreate,
  commentLike,
  commentUpdate,
  commentDestroy,
  commentIndex,
};
