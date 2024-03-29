import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authStart,
  authFailure,
  loginSuccess,
  authReset,
} from "../redux/slices/authSlice";
import { UserForm, UserData } from "../types/userType";
import { RootState } from "../redux/store";
import { loginStore } from "../api/authApi";
import OAuth from "../components/OAuth";
import { ErrMsg, IsLoading } from "../types/authType";
import { handleDispatchError } from "../utils/error";

const initialState: UserForm = {
  username: "",
  email: "",
  password: "",
};

interface UseSelector {
  isLoading: IsLoading;
  errMsg: ErrMsg;
}

const LoginPage: React.FC = function () {
  const [formData, setFormData] = useState(initialState);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { errMsg, isLoading }: UseSelector = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    dispatch(authReset());
  }, [dispatch]);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      dispatch(authStart());
      const res: UserData = await loginStore(formData);
      dispatch(loginSuccess(res));
      navigate("/");
    } catch (error) {
      handleDispatchError(error, dispatch, authFailure);
    } finally {
      setFormData(initialState);
    }
  };
  return (
    <MainLayout>
      <div className="p-3 my-20 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5">
          {/* left */}
          <div className="flex-1 md:mt-16">
            <Link
              to="/"
              className="font-bold dark:text-white text-3xl md:text-4xl"
            >
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Thujuli's
              </span>
              Blog
            </Link>
            <p className="text-sm mt-5">
              This is a demo project. You can login with your email and password
              or with Google.
            </p>
          </div>

          {/* right */}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  value="Email"
                  htmlFor="email"
                  className="text-base ml-2"
                />
                <TextInput
                  type="email"
                  placeholder="example@mail.com"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label
                  value="Password"
                  htmlFor="password"
                  className="text-base ml-2"
                />
                <TextInput
                  type="password"
                  placeholder="********"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button
                gradientDuoTone="purpleToPink"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
            <div className="mt-2">
              <OAuth />
            </div>
            <div className="flex gap-2 text-sm mt-3">
              <span>Don't have an account?</span>
              <Link to="/register" className="text-blue-500">
                Register
              </Link>
            </div>
            {errMsg && (
              <Alert
                color="failure"
                icon={HiInformationCircle}
                className="mt-5"
              >
                <span className="font-medium">{errMsg}</span>
              </Alert>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoginPage;
