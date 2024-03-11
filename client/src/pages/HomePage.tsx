import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link } from "react-router-dom";
import { PostData, PostsResponse } from "../types/postType";
import axios, { AxiosError } from "axios";
import { postIndex } from "../api/postApi";
import PostCard from "../components/PostCard";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: PostsResponse = await postIndex({});
        setPosts(res.posts);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };

    fetchData();
  }, []);
  return (
    <MainLayout>
      <div className="py-28 px-3 lg:px-28 space-y-6 ">
        <h1 className="text-3xl lg:text-5xl font-bold">Welcome to my Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 lg:text-lg">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="inline-block font-medium lg:text-lg text-teal-500 dark:text-teal-400 hover:underline"
        >
          View all posts
        </Link>
      </div>

      {posts.length > 0 && (
        <div className="px-3 md:px-10">
          <h2 className="text-xl lg:text-3xl font-bold text-center">
            Recent Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {posts.map((post) => (
              <PostCard post={post} />
            ))}
          </div>
          {posts.length > 9 && (
            <Link
              to="/search"
              className="block my-6 text-center font-medium lg:text-lg text-teal-500 dark:text-teal-400 hover:underline"
            >
              View all posts
            </Link>
          )}
        </div>
      )}
    </MainLayout>
  );
};

export default HomePage;
