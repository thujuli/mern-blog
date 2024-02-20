import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser, ErrMsg, IsLoading, SuccessMsg } from "../types/authType";
import {
  Alert,
  Button,
  Label,
  Modal,
  Spinner,
  TextInput,
} from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../utils/firebase";
import { UserForm, UserData } from "../types/userType";
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
  logoutSuccess,
} from "../redux/slices/authSlice";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Link, useNavigate } from "react-router-dom";
import { handleDispatchError } from "../utils/error";
import { logoutDestroy } from "../api/authApi";

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
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploadError, setFileUploadError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [warnMsg, setWarnMsg] = useState("");
  const filePickerRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(userReset());
  }, [dispatch]);

  useEffect(() => {
    if (file) {
      const uploadImage = async () => {
        const storage = getStorage(app);
        const fileName = `/users/${new Date().getTime()}-${file.name}`;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileUploadProgress(Number(progress.toFixed(0)));
            setFileUploading(true);
          },
          () => {
            setFileUploadError(
              `Could not upload image (File must be less than 2MB)`
            );
            setFileUploadProgress(0);
            setFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFileUrl(downloadURL);
              setFileUploadError("");
              setFileUploading(false);
              setFormData({ ...formData, profilePicture: downloadURL });
            });
          }
        );
      };
      uploadImage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setFile(selectedFiles[0]);
      setFileUrl(URL.createObjectURL(selectedFiles[0]));
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    let formDataHasValue = false;
    Object.values(formData).forEach((value: string) => {
      if (value.length > 0) {
        formDataHasValue = true;
      }
    });
    if (!formDataHasValue) {
      dispatch(userReset());
      return setWarnMsg(
        "Please ensure you've entered your updated profile details before saving."
      );
    }

    if (currentUser) {
      try {
        dispatch(userUpdateStart());
        setWarnMsg("");
        const res: UserData = await userUpdate(currentUser._id, formData);
        dispatch(
          userUpdateSuccess({ message: "User updated successfully", user: res })
        );
        setFileUploadProgress(0);
      } catch (error) {
        setWarnMsg("");
        handleDispatchError(error, dispatch, userUpdateFailure);
      } finally {
        setFormData(initialState);
      }
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

  const handleLogout: React.MouseEventHandler<HTMLSpanElement> = async () => {
    await logoutDestroy();
    dispatch(logoutSuccess());
    navigate("/login");
  };

  return (
    <div className="grow mx-auto p-4 w-full md:w-0 md:max-w-lg">
      <h1 className="mt-10 my-5 font-semibold text-3xl text-center">Profile</h1>
      <form
        className="flex flex-col gap-4 justify-center mb-4"
        onSubmit={handleSubmit}
      >
        <div
          className="w-32 h-32 rounded-full shadow-xl mx-auto relative  hover:cursor-pointer"
          onClick={() => filePickerRef.current?.click()}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            ref={filePickerRef}
            className="hidden"
          />
          {fileUploadProgress ? (
            <CircularProgressbar
              value={fileUploadProgress || 0}
              strokeWidth={5}
              className="w-full h-full absolute top-0 left-0"
            />
          ) : (
            ""
          )}
          <img
            src={fileUrl || currentUser?.profilePicture}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-full border-4"
          />
        </div>
        {fileUploadError && (
          <Alert color="failure" icon={HiInformationCircle}>
            <span className="font-medium">{fileUploadError}</span>
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
          disabled={isLoading || fileUploading}
        >
          {isLoading || fileUploading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-3">Loading...</span>
            </>
          ) : (
            "Update"
          )}
        </Button>
      </form>
      {currentUser?.isAdmin && (
        <Link to="/posts/create">
          <Button
            gradientDuoTone="pinkToOrange"
            type="button"
            className="w-full"
          >
            Create Post
          </Button>
        </Link>
      )}
      <div className="flex flex-row justify-between mt-3">
        <span
          className="cursor-pointer text-red-500"
          onClick={() => setShowModal(true)}
        >
          Delete Account
        </span>
        <span className="cursor-pointer text-red-500" onClick={handleLogout}>
          Logout
        </span>
      </div>
      {warnMsg && (
        <Alert color="warning" icon={HiInformationCircle} className="mt-5">
          <span className="font-medium">{warnMsg}</span>
        </Alert>
      )}
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
              Are you sure you want to delete your account?
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
