import React, { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import {
  Alert,
  Button,
  FileInput,
  Progress,
  Select,
  Spinner,
  TextInput,
} from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import app from "../utils/firebase";
import { HiInformationCircle } from "react-icons/hi";

const initialState = {
  title: "",
  categories: "",
  postImage: "",
  content: "",
};

const CreatePost: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [formData, setFormData] = useState(initialState);
  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileUpload: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    try {
      if (file) {
        const storage = getStorage(app);
        const fileName = `/posts/${new Date().getTime()}-${file.name}`;
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
            setFileUrl("");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFileUrl(downloadURL);
              setFileUploadError("");
              setFileUploading(false);
              setFormData({ ...formData, postImage: downloadURL });
            });
          }
        );
      } else {
        setFileUploadError("Please select an image");
      }
    } catch (error) {
      console.error(error);
      setFileUploadError("Image upload failed");
      setFileUploadProgress(0);
      setFileUploading(false);
    }
  };
  return (
    <MainLayout>
      <div className="p-3 my-20 max-w-2xl mx-auto">
        <h1 className="text-center text-3xl font-semibold">Create Post</h1>
        <form className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <TextInput
              id="title"
              placeholder="Title"
              required
              className="grow"
            />
            <Select id="catgories" required className="grow-0">
              <option value="uncategorized">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="react">React</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex flex-col gap-4 p-3 border-2 border-dashed rounded items-center border-blue-400 dark:border-blue-300 sm:flex-row">
            <FileInput
              accept="image/*"
              onChange={handleFileSelected}
              className="flex-1 w-full"
            />
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              outline
              onClick={handleFileUpload}
              disabled={fileUploading}
              className="flex-0 w-full sm:w-fit"
            >
              {fileUploading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Upload image"
              )}
            </Button>
          </div>
          {fileUploading && (
            <Progress
              progress={fileUploadProgress}
              size="lg"
              color="indigo"
              labelProgress
              className="text-red"
            />
          )}
          {fileUploadError && (
            <Alert color="failure" icon={HiInformationCircle}>
              <span className="font-medium">{fileUploadError}</span>
            </Alert>
          )}
          {fileUrl && (
            <img
              src={fileUrl}
              alt="Post Image"
              className="h-72 w-full object-cover"
            />
          )}
          <ReactQuill theme="snow" className="h-72" />
          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            className="mt-12"
          >
            Submit
          </Button>
        </form>
      </div>
    </MainLayout>
  );
};

export default CreatePost;
