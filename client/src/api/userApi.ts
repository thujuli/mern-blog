import axios from "axios";
import { IUserForm } from "../types/userType";

const userUpdate = async (userId: string, data: IUserForm) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    data
  );
  return res.data;
};

export { userUpdate };
