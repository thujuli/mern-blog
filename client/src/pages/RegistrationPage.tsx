import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";

const initialFormData = {
  username: "",
  email: "",
  password: "",
};

const RegistrationPage: React.FC = function () {
  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        setErrMsg("Internal Server Error");
      } else {
        navigate("/login");
      }
    } catch (error) {
      setErrMsg(
        error instanceof Error ? error.message : "An unknown error occured"
      );
    } finally {
      setIsLoading(false);
      setFormData(initialFormData);
    }
  };
  return (
    <MainLayout>
      <div className="p-3 mt-20 max-w-3xl mx-auto">
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
              This is a demo project. You can sign up with your email and
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
              <Button gradientDuoTone="purpleToPink" type="submit">
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
            <div className="flex gap-2 text-sm mt-3">
              <span>Have an account?</span>
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
