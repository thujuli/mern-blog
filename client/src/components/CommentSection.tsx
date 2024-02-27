import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";
import { Link, useNavigate } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";
import { commentCreate, commentLike } from "../api/commentApi";
import { CommentData } from "../types/commentType";
import Comment from "./Comment";
import { postComments } from "../api/postApi";
import axios, { AxiosError } from "axios";

interface Props {
  postId: string;
}

const CommentSection: React.FC<Props> = ({ postId }: Props) => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<CommentData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const comments: CommentData[] = await postComments(postId);
        setComments(comments);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };
    fetchData();
  }, [postId]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      const res: CommentData = await commentCreate({
        content: comment,
        postId,
      });
      setComment("");
      setComments([res, ...comments]);
    } catch (error) {
      const err = error as AxiosError | Error;
      axios.isAxiosError(err)
        ? console.error(err.response?.data?.message)
        : console.error(err.message);
    }
  };

  const handleLike = async (commentId: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res: CommentData = await commentLike(commentId);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, likes: res.likes, numberOfLikes: res.numberOfLikes }
            : comment
        )
      );
    } catch (error) {
      const err = error as AxiosError | Error;
      axios.isAxiosError(err)
        ? console.error(err.response?.data?.message)
        : console.error(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-3 pb-3">
      {currentUser ? (
        <div className="text-sm flex gap-2 items-center">
          <span className="text-gray-400">Login as: </span>
          <img
            src={currentUser.profilePicture}
            alt={currentUser.username}
            className="w-6 h-6 object-cover rounded-full"
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-teal-400 hover:underline"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <>
          <span className="text-sm text-teal-300">
            You must be logged in to comment.{" "}
          </span>
          <Link
            to="/login"
            className="text-sm font-medium underline text-blue-400"
          >
            Login
          </Link>
        </>
      )}
      {currentUser && (
        <form
          onSubmit={handleSubmit}
          className="p-3 border-teal-400 border rounded-xl mt-3"
        >
          <Textarea
            placeholder="Leave a comment..."
            rows={4}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-between items-center mt-5">
            <span className="text-xs text-gray-400">
              {200 - comment.length} characters remaining
            </span>
            <Button
              type="submit"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
            >
              Submit
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm mt-5">No comment yet!</p>
      ) : (
        <div className="mt-5 text-sm flex gap-2 items-center">
          <span>Comments</span>
          <div className="py-1 px-2 border rounded-sm">{comments.length}</div>
        </div>
      )}
      {comments.map((comment) => (
        <Comment key={comment._id} comment={comment} onLike={handleLike} />
      ))}
    </div>
  );
};

export default CommentSection;
