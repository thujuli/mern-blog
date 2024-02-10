import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";
import { Navigate } from "react-router-dom";
interface Props {
  component: React.ReactNode;
}

const AdminRoute: React.FC<Props> = ({ component }: Props) => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  return currentUser?.isAdmin ? component : <Navigate to="/" replace />;
};

export default AdminRoute;
