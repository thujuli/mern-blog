import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser, ErrMsg, IsLoading, SuccessMsg } from "../types/authType";
import { Alert, Button, Label, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../utils/firebase";
import { UserForm, UserResponse } from "../types/userType";
import { userUpdate } from "../api/userApi";
import axios, { AxiosError } from "axios";
import { useCookies } from "react-cookie";
import { HiInformationCircle } from "react-icons/hi";
import {
  userUpdateFailure,
  userUpdateReset,
  userUpdateStart,
  userUpdateSuccess,
} from "../redux/slices/authSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const initialState: UserForm = {
  username: "",
  email: "",
  password: "",
  profilePicture: "",
};

interface UseSelector {
  currentUser: CurrentUser;
  isLoading: IsLoading;
  errMsg: ErrMsg;
  successMsg: SuccessMsg;
}

const DashProfile: React.FC = () => {
  const { currentUser, isLoading, errMsg, successMsg }: UseSelector =
    useSelector((state: RootState) => state.auth);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    number | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    dispatch(userUpdateReset());
  }, [dispatch]);

  useEffect(() => {
    if (imageFile) {
      const uploadImage = async () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + imageFile!.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, imageFile!);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setImageFileUploadProgress(Number(progress.toFixed(0)));
          },
          () => {
            setImageFileUploadError(
              `Could not upload image (File must be less than 2MB)`
            );
            setImageFileUploadProgress(0);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
              setImageFileUploadError(null);
              setFormData({ ...formData, profilePicture: downloadURL });
            });
          }
        );
      };
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageFile]);

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setImageFile(selectedFiles[0]);
      setImageFileUrl(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      dispatch(userUpdateStart());
      const res: UserResponse = await userUpdate(currentUser!._id, {
        ...formData,
        access_token: cookies.access_token,
      });
      dispatch(
        userUpdateSuccess({ message: "User updated successfully", user: res })
      );
      setImageFileUploadProgress(0);
    } catch (err) {
      const error = err as AxiosError | Error;
      if (axios.isAxiosError(error)) {
        dispatch(userUpdateFailure(error.response?.data.message));
      } else {
        dispatch(userUpdateFailure(error.message));
      }
    } finally {
      setFormData(initialState);
    }
  };

  return (
    <div className="grow mx-auto p-4 w-full md:w-0 md:max-w-lg">
      <h1 className="mt-10 my-5 font-semibold text-3xl text-center">Profile</h1>
      <form
        className="flex flex-col gap-4 justify-center"
        onSubmit={handleSubmit}
      >
        <div
          className="w-32 h-32 rounded-full shadow-xl mx-auto relative  hover:cursor-pointer"
          onClick={() => filePickerRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            className="hidden"
          />
          {imageFileUploadProgress ? (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              strokeWidth={5}
              className="w-full h-full absolute top-0 left-0"
            />
          ) : (
            ""
          )}
          <img
            src={imageFileUrl || currentUser?.profilePicture}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-full border-4"
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">{imageFileUploadError}</span>
          </Alert>
        )}
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
            defaultValue={currentUser?.username}
            onChange={handleChange}
            disabled={isLoading}
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
            defaultValue={currentUser?.email}
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
          />
        </div>
        <Button
          gradientDuoTone="purpleToPink"
          type="submit"
          outline
          disabled={isLoading}
        >
          Update
        </Button>
      </form>
      <div className="flex flex-row justify-between mt-3">
        <span className="cursor-pointer text-red-500">Delete Account</span>
        <span className="cursor-pointer text-red-500">Logout</span>
      </div>
      {errMsg && (
        <Alert color="failure" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium">{errMsg}</span>
        </Alert>
      )}
      {successMsg && (
        <Alert color="success" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium">{successMsg}</span>
        </Alert>
      )}
    </div>
  );
};

export default DashProfile;
