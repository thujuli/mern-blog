import MainTemplate from "../layouts/MainTemplate";
import { Button, Label, TextInput } from "flowbite-react";
import { Link } from "react-router-dom";

export default function RegistrationPage() {
  return (
    <MainTemplate>
      <div className="flex p-3 mt-20 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Thujuli's
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>

        {/* right */}
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label
                value="Username"
                htmlFor="username"
                className="text-base"
              />
              <TextInput type="text" placeholder="Jhon Doe" id="username" />
            </div>
            <div>
              <Label value="Email" htmlFor="email" className="text-base" />
              <TextInput
                type="text"
                placeholder="example@mail.com"
                id="email"
              />
            </div>
            <div>
              <Label
                value="Password"
                htmlFor="password"
                className="text-base"
              />
              <TextInput type="password" placeholder="********" id="password" />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Register
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/login" className="text-blue-500">
              Login
            </Link>
          </div>
        </div>
      </div>
    </MainTemplate>
  );
}
