import axios, { AxiosRequestConfig } from "axios";
import { UserForm } from "../types/userType";
import { GoogleResponse } from "../types/authType";

const config: AxiosRequestConfig = {
  withCredentials: true,
};

const loginStore = async (data: UserForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    data,
    config
  );
  return res.data;
};

const registrationStore = async (data: UserForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
    data
  );
  return res.data;
};

const googleStore = async (data: GoogleResponse) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
    data,
    config
  );
  return res.data;
};

export { loginStore, registrationStore, googleStore };
