import axios from "axios";
import { UserForm } from "../types/userType";

const userUpdate = async (userId: string, data: UserForm) => {
  const res = await axios.put(
    `${import.meta.env.VITE_API_BASE_URL}/users/${userId}`,
    data
  );
  return res.data;
};

export { userUpdate };
