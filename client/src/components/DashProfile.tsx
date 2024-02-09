import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser, ErrMsg, IsLoading, SuccessMsg } from "../types/authType";
import { Alert, Button, Label, Modal, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../utils/firebase";
import { UserForm, UserResponse } from "../types/userType";
import { userDestroy, userUpdate } from "../api/userApi";
import {
  HiInformationCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import {
  userUpdateFailure,
  userReset,
  userUpdateStart,
  userUpdateSuccess,
  userDestroyStart,
  userDestroySuccess,
  userDestroyFailure,
} from "../redux/slices/authSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { handleDispatchError } from "../utils/error";

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
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const filePickerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userReset());
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
      const res: UserResponse = await userUpdate(currentUser!._id, formData);
      dispatch(
        userUpdateSuccess({ message: "User updated successfully", user: res })
      );
      setImageFileUploadProgress(0);
    } catch (error) {
      handleDispatchError(error, dispatch, userUpdateFailure);
    } finally {
      setFormData(initialState);
    }
  };

  const handleUserDestroy: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    setShowModal(false);
    try {
      if (currentUser) {
        dispatch(userDestroyStart());
        await userDestroy(currentUser._id);
        dispatch(userDestroySuccess());
        navigate("/");
      }
    } catch (error) {
      handleDispatchError(error, dispatch, userDestroyFailure);
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
        <span
          className="cursor-pointer text-red-500"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
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
      <Modal
        show={showModal}
        size="md"
        onClose={() => setShowModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this product?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleUserDestroy}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
