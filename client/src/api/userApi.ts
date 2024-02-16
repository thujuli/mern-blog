import axios from "axios";
import { UserForm, UserParams } from "../types/userType";

axios.defaults.withCredentials = true;

const userUpdate = async (userId: string, data: UserForm) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    data
  );
  return res.data;
};

const userDestroy = async (userId: string) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
  );
  return res.data;
};

const userIndex = async (params: UserParams) => {
  const queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/users?${queryParams}`
  );
  return res.data;
};

export { userUpdate, userDestroy, userIndex };
