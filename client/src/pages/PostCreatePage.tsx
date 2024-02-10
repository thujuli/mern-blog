import React from "react";
import MainLayout from "../layouts/MainLayout";
import { Button, FileInput, Select, TextInput } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost: React.FC = () => {
  return (
    <MainLayout>
      <div className="p-3 my-20 max-w-2xl mx-auto">
        <h1 className="text-center text-3xl font-semibold">Create Post</h1>
        <form className="flex flex-col gap-4 mt-5">
          <div className="flex flex-col gap-4 sm:flex-row">
            <TextInput placeholder="Title" required className="grow" />
            <Select id="catgories" required className="grow-0">
              <option value="uncategorized">Select a category</option>
              <option value="javascript">Javascript</option>
              <option value="react">React</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>
          <div className="flex flex-col gap-4 p-3 border-2 border-dashed rounded items-center border-blue-400 dark:border-blue-300 sm:flex-row">
            <FileInput id="file" accept="image/*" className="flex-1 w-full" />
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              outline
              className="flex-0 w-full sm:w-fit"
            >
              Upload image
            </Button>
          </div>
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
