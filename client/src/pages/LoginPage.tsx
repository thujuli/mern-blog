import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/slices/userSlice";
import { IUserForm, IUserResponse } from "../types/userType";
import { RootState } from "../redux/store";
import { loginCreate } from "../api/authApi";
import axios, { AxiosError } from "axios";

const initialFormData: IUserForm = {
  username: "",
  email: "",
  password: "",
};

const LoginPage: React.FC = function () {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { errMsg, isLoading } = useSelector((state: RootState) => state.user);

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginStart());

      const res: IUserResponse = await loginCreate(formData);
      dispatch(loginSuccess(res));
      navigate("/");
    } catch (err) {
      const error = err as Error | AxiosError;

      if (axios.isAxiosError(error)) {
        dispatch(loginFailure(error.response?.data.message));
      } else {
        dispatch(loginFailure(error.message ?? "An unknown error occured"));
      }
    } finally {
      setFormData(initialFormData);
    }
  };
  return (
    <MainLayout>
      <div className="p-3 mt-20 max-w-3xl mx-auto">
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
                <Label value="Email" htmlFor="email" className="text-base" />
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
                  className="text-base"
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
              <Button gradientDuoTone="purpleToPink" type="submit">
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
