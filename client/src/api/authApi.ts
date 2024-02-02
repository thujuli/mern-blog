import axios, { AxiosResponse } from "axios";
import { IUserForm } from "../types/userType";

const loginStore = async (data: IUserForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    data
  );
  return res.data;
};

const registrationStore = async (data: IUserForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
    data
  );
  return res.data;
};

export { loginStore, registrationStore };
