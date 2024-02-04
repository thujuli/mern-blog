import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { ICurrentUser } from "../types/authType";
import { Button, Label, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../utils/firebase";

const DashProfile: React.FC = () => {
  const { currentUser }: { currentUser: ICurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState<
    string | null
  >(null);
  const [imageFileUploadError, setImageFileUploadError] = useState<
    string | null
  >(null);
  const filePickerRef = useRef<HTMLInputElement>(null);
  // console.log(imageFileUploadProgress, imageFileUploadError);

  const handleImageChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      setImageFile(selectedFiles[0]);
      setImageFileUrl(URL.createObjectURL(selectedFiles[0]));
    }
  };

  // TODO: Blocked by CORS Policy Firebase Storage
  // Effort => Setup from GCP via terminal
  //        => Setup from local using gsutil
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
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError(`Upload failed: ${error.message}`);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
            });
          }
        );
      };
      uploadImage();
    }
  }, [imageFile]);
  return (
    <div className="grow mx-auto p-4 w-full md:w-0 md:max-w-lg">
      <h1 className="mt-10 my-5 font-semibold text-3xl text-center">Profile</h1>
      <form className="flex flex-col gap-4 justify-center">
        <div className="w-32 h-32 rounded-full border-4 shadow-xl mx-auto">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            className="hidden"
          />
          <img
            src={imageFileUrl ?? currentUser?.profilePicture}
            alt="Profile Picture"
            onClick={() => filePickerRef.current?.click()}
            className="w-full h-full object-cover rounded-full hover:cursor-pointer"
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
            // value={currentUser?.username}
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
            // value={currentUser?.email}
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
