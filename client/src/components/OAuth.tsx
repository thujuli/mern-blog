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
import { IIsLoading } from "../types/authType";

const OAuth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading }: { isLoading: IIsLoading } = useSelector(
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
    } catch (err) {
      const error = err as AxiosError | Error;

      if (axios.isAxiosError(error)) {
        console.log(error.response?.data.message);
      } else {
        console.log(error.message);
      }
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
