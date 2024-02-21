import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";
import { Link } from "react-router-dom";
import { Button, Textarea } from "flowbite-react";
import { commentCreate } from "../api/commentApi";

interface Props {
  postId: string;
}

const CommentSection: React.FC<Props> = ({ postId }: Props) => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [comment, setComment] = useState("");
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (comment.length > 200) {
      return;
    }

    try {
      await commentCreate({ content: comment, postId });
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="max-w-2xl mx-auto px-3 pb-3">
      {currentUser ? (
        <>
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
        </>
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
    </div>
  );
};

export default CommentSection;
