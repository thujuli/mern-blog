import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal, Textarea } from "flowbite-react";
import {
  commentCreate,
  commentDestroy,
  commentLike,
  commentUpdate,
} from "../api/commentApi";
import { CommentData } from "../types/commentType";
import Comment from "./Comment";
import { postComments, postIndex } from "../api/postApi";
import axios, { AxiosError } from "axios";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { PostData, PostsResponse } from "../types/postType";
import PostCard from "./PostCard";

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
  const [showModal, setShowModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [recentPosts, setRecentPosts] = useState<PostData[] | null>(null);

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

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const res: PostsResponse = await postIndex({ limit: 3 });
        setRecentPosts(res.posts);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };
    fetchRecentPosts();
  }, []);

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

  const handleEdit = async (commentId: string, content: string) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res: CommentData = await commentUpdate(commentId, content);
      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? {
                ...comment,
                content: res.content,
              }
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

  const handleDelete = (commentId: string) => {
    setShowModal(true);
    setCommentToDelete(commentId);
  };

  const handleCommentDestroy: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (commentToDelete) {
      try {
        await commentDestroy(commentToDelete);
        setComments(
          comments.filter((comment) => comment._id !== commentToDelete)
        );
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    }
    setShowModal(false);
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
        <Comment
          key={comment._id}
          comment={comment}
          onLike={handleLike}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
      <div className="my-5">
        <h2 className="mt-5 text-2xl text-center">Recent Articles</h2>
        <div className="flex flex-wrap gap-6 mt-5">
          {recentPosts &&
            recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
      </div>
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
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleCommentDestroy}>
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

export default CommentSection;
