import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Navigate } from "react-router-dom";

interface Props {
  component: React.ReactNode;
}

const PrivateRoute: React.FC<Props> = ({ component }: Props) => {
  const { currentUser } = useSelector((state: RootState) => state.auth);
  return currentUser ? component : <Navigate to="/login" />;
};

export default PrivateRoute;
