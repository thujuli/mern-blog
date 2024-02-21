import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { Link, useParams } from "react-router-dom";
import { PostData, PostsResponse } from "../types/postType";
import { postIndex } from "../api/postApi";
import { Button, Spinner } from "flowbite-react";
import CommentSection from "../components/CommentSection";

const PostShowPage: React.FC = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<PostData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res: PostsResponse = await postIndex({ slug });
        setPost(res.posts[0]);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [slug]);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (post) {
    return (
      <MainLayout>
        <main className="p-3 flex flex-col max-w-6xl mx-auto">
          <h1 className="text-center text-3xl mt-10 font-serif max-w-2xl mx-auto">
            {post.title}
          </h1>
          <Link
            to={`/search?category=${post.category}`}
            className="mt-5 self-center"
          >
            <Button color="gray" pill size="xs">
              {post.category}
            </Button>
          </Link>
          <img
            src={post.imageUrl}
            alt={post.title}
            className="mt-10 p-3 max-h-[600px] w-full object-cover"
          />
          <div className="p-3 flex justify-between border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="italic">
              {(post.content.length / 1000).toFixed()} mins read
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: post.content }}
            className="px-3 mx-auto w-full max-w-2xl post-content"
          ></div>
        </main>
        <CommentSection postId={post._id} />
      </MainLayout>
    );
  }
};

export default PostShowPage;
