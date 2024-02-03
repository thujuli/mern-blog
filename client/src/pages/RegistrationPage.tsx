import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { IUserForm } from "../types/userType";
import { IIsLoading, IErrMsg } from "../types/authType";
import { authDone, authFailure, authStart } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { registrationStore } from "../api/authApi";
import axios, { AxiosError } from "axios";
import OAuth from "../components/OAuth";

const initialFormData: IUserForm = {
  username: "",
  email: "",
  password: "",
};

interface IUseSelector {
  isLoading: IIsLoading;
  errMsg: IErrMsg;
}

const RegistrationPage: React.FC = function () {
  const [formData, setFormData] = useState(initialFormData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, errMsg }: IUseSelector = useSelector(
    (state: RootState) => state.auth
  );

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      dispatch(authStart());
      await registrationStore(formData);
      dispatch(authDone());
      navigate("/login");
    } catch (err) {
      const error = err as AxiosError | Error;

      if (axios.isAxiosError(error)) {
        dispatch(authFailure(error.response?.data.message));
      } else {
        dispatch(authFailure(error.message ?? "An unknown error occured"));
      }
    } finally {
      setFormData(initialFormData);
    }
  };
  return (
    <MainLayout>
      <div className="p-3 my-20 max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-5">
          {/* left */}
          <div className="flex-1 md:mt-24">
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
              This is a demo project. You can registration with your email and
              password or with Google.
            </p>
          </div>

          {/* right */}
          <div className="flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div>
                <Label
                  value="Username"
                  htmlFor="username"
                  className="text-base"
                />
                <TextInput
                  type="text"
                  placeholder="Jhon Doe"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
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
                  "Register"
                )}
              </Button>
            </form>
            <div className="mt-2">
              <OAuth />
            </div>
            <div className="flex gap-2 text-sm mt-3">
              <span>Already have an account?</span>
              <Link to="/login" className="text-blue-500">
                Login
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

export default RegistrationPage;
