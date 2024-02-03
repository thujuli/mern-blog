import axios from "axios";
import { IUserForm } from "../types/userType";
import { IGoogleResponse } from "../types/authType";

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

const googleStore = async (data: IGoogleResponse) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/google`,
    data
  );
  return res.data;
};

export { loginStore, registrationStore, googleStore };
