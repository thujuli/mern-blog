import { Button } from "flowbite-react";
import React from "react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import app from "../utils/firebase";
import { googleStore } from "../api/authApi";
import axios, { AxiosError } from "axios";
import { useDispatch, useSelector } from "react-redux";
import { authStart, loginSuccess } from "../redux/slices/authSlice";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { IsLoading } from "../types/authType";

const OAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading }: { isLoading: IsLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = async () => {
    dispatch(authStart());
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
      const resultFromGoogle = await signInWithPopup(auth, provider);
      const { displayName, email, photoURL } = resultFromGoogle.user;

      const res = await googleStore({ displayName, email, photoURL });
      dispatch(loginSuccess(res));
      navigate("/");
    } catch (error) {
      const err = error as AxiosError | Error;
      axios.isAxiosError(err)
        ? console.error(err.response?.data?.message)
        : console.error(err.message);
    }
  };
  return (
    <Button
      gradientDuoTone="pinkToOrange"
      outline
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="w-full"
    >
      <AiFillGoogleCircle className="h-5 w-5 mr-1" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
