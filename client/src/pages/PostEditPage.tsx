import React, { useEffect, useState } from "react";
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
import { PostForm, PostData, PostsResponse } from "../types/postType";
import { postIndex, postUpdate } from "../api/postApi";
import axios, { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";

const initialState: PostForm = {
  title: "",
  content: "",
  category: "",
  imageUrl: "",
};

const status = {
  isLoading: false,
  errorMsg: "",
};

const PostEditPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploading, setFileUploading] = useState(false);
  const [fileUploadError, setFileUploadError] = useState("");
  const [formData, setFormData] = useState(initialState);
  const [updateStatus, setUpdateStatus] = useState(status);
  const [quill, setQuill] = useState("");
  const navigate = useNavigate();
  const { postId } = useParams();

  useEffect(() => {
    if (postId) {
      const fetchData = async () => {
        try {
          const res: PostsResponse = await postIndex({ postId });
          setFormData(res.posts[0]);
          setQuill(res.posts[0].content);
        } catch (error) {
          const err = error as AxiosError | Error;
          axios.isAxiosError(err)
            ? console.error(err.response?.data?.message)
            : console.error(err.message);
        }
      };

      fetchData();
    }
  }, [postId]);

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
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setFileUploadError("");
              setFileUploading(false);
              setFormData({ ...formData, imageUrl: downloadURL });
            });
          }
        );
      } else {
        setFileUploadError("Please select an image");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      setFileUploadError("Image upload failed");
      setFileUploadProgress(0);
      setFileUploading(false);
    }
  };

  const handleChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement
  > = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleChangeQuill = (event: string) => {
    setQuill(event);
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (postId) {
      try {
        setUpdateStatus({ errorMsg: "", isLoading: true });
        const updatedPost: PostData = await postUpdate(postId, {
          ...formData,
          content: quill,
        });
        navigate(`/posts/${updatedPost.slug}`);
      } catch (error) {
        const err = error as AxiosError | Error;
        if (axios.isAxiosError(err)) {
          console.error(err.response?.data?.message);
          setUpdateStatus({
            errorMsg: err.response?.data?.message,
            isLoading: false,
          });
        } else {
          console.error(err.message);
          setUpdateStatus({
            errorMsg: err.message,
            isLoading: false,
          });
        }
      }
    }
  };
  return (
    <MainLayout>
      <div className="p-3 my-20 max-w-2xl mx-auto">
        <h1 className="text-center text-3xl font-semibold">Update Post</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <TextInput
              id="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              disabled={updateStatus.isLoading}
              required
              className="grow"
            />
            <Select
              id="category"
              value={formData.category}
              onChange={handleChange}
              disabled={updateStatus.isLoading}
              required
              className="grow-0"
            >
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
              disabled={updateStatus.isLoading}
              className="flex-1 w-full"
            />
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              outline
              onClick={handleFileUpload}
              disabled={fileUploading || updateStatus.isLoading}
              className="flex-0 w-full sm:w-fit"
            >
              {fileUploading || updateStatus.isLoading ? (
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
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Post Image"
              className="h-72 w-full object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            readOnly={updateStatus.isLoading}
            value={quill}
            onChange={handleChangeQuill}
            className="h-72"
          />
          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            disabled={updateStatus.isLoading}
            className="mt-12"
          >
            {updateStatus.isLoading ? (
              <>
                <Spinner size="sm" />
                <span className="pl-3">Loading...</span>
              </>
            ) : (
              "Update"
            )}
          </Button>
        </form>
        {updateStatus.errorMsg && (
          <Alert color="failure" icon={HiInformationCircle} className="mt-5">
            <span className="font-medium">{updateStatus.errorMsg}</span>
          </Alert>
        )}
      </div>
    </MainLayout>
  );
};

export default PostEditPage;
