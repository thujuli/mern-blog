import axios, { AxiosRequestConfig } from "axios";
import { UserForm, UserParams } from "../types/userType";

const config: AxiosRequestConfig = {
  withCredentials: true,
};

const userUpdate = async (userId: string, data: UserForm) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    data,
    config
  );
  return res.data;
};

const userDestroy = async (userId: string) => {
  const res = await axios.delete(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    config
  );
  return res.data;
};

const userIndex = async (params: UserParams) => {
  const queryParams = new URLSearchParams(
    params as Record<string, string>
  ).toString();
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/users?${queryParams}`,
    config
  );
  return res.data;
};

const userShow = async (userId: string) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`
  );
  return res.data;
};

export { userUpdate, userDestroy, userIndex, userShow };
