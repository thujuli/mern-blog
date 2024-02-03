import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ICurrentUser } from "../types/authType";
import { Button, Label, TextInput } from "flowbite-react";

const DashProfile: React.FC = () => {
  const { currentUser }: { currentUser: ICurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  return (
    <div className="grow mx-auto p-4 w-full md:w-0 md:max-w-lg">
      <h1 className="mt-10 my-5 font-semibold text-3xl text-center">Profile</h1>
      <form className="flex flex-col gap-4 justify-center">
        <div className="w-32 h-32 rounded-full border-4 shadow-xl mx-auto">
          <img
            src={currentUser?.profilePicture}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div>
          <Label
            value="Username"
            htmlFor="username"
            className="text-base ml-2"
          />
          <TextInput
            type="text"
            placeholder="Jhon Doe"
            id="username"
            name="username"
            value={currentUser?.username}
            required
          />
        </div>
        <div>
          <Label value="Email" htmlFor="email" className="text-base ml-2" />
          <TextInput
            type="email"
            placeholder="example@mail.com"
            id="email"
            name="email"
            value={currentUser?.email}
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
            required
          />
        </div>
        <Button gradientDuoTone="purpleToPink" type="submit" outline>
          Update
        </Button>
      </form>
      <div className="flex flex-row justify-between mt-3">
        <span className="cursor-pointer text-red-500">Delete Account</span>
        <span className="cursor-pointer text-red-500">Logout</span>
      </div>
    </div>
  );
};

export default DashProfile;
