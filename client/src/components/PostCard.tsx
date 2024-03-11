import React from "react";
import { PostData } from "../types/postType";
import { Link } from "react-router-dom";
import { Button } from "flowbite-react";

interface Porps {
  post: PostData;
}

const PostCard: React.FC<Porps> = ({ post }: Porps) => {
  return (
    <div className="flex flex-col justify-between gap-2 w-full border border-teal-500 rounded-lg hover:border-transparent hover:ring hover:ring-teal-500 overflow-hidden ">
      <Link to={`/posts/${post.slug}`}>
        <img
          src={post.imageUrl}
          alt="Post Cover"
          className="w-full h-[260px] object-cover"
        />
      </Link>
      <div className="px-2">
        <p className="text-xl leading-normal font-medium line-clamp-2">
          {post.title}
        </p>
        <p className="italic">{post.category}</p>
      </div>
      <Link to={`/posts/${post.slug}`} className="px-2 mb-4">
        <Button
          gradientDuoTone="purpleToBlue"
          size="sm"
          outline
          className="w-full mt-4"
        >
          Read Article
        </Button>
      </Link>
    </div>
  );
};

export default PostCard;
