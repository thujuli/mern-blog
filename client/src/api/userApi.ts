import axios, { AxiosRequestConfig } from "axios";
import { IUserForm } from "../types/userType";

const config: AxiosRequestConfig = {
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  withCredentials: true,
};

const userUpdate = async (userId: string, data: IUserForm) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    data,
    config
  );
  return res.data;
};

export { userUpdate };
