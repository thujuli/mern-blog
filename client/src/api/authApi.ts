import axios from "axios";
import { IUserForm } from "../types/userType";

const loginCreate = async (data: IUserForm) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/auth/login`,
    data
  );
  return res.data;
};

export { loginCreate };
