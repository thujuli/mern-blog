import axios from "axios";
import { UserForm } from "../types/userType";

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

export { userUpdate, userDestroy };
