import React, { useEffect, useState } from "react";
import moment from "moment";
import { CommentData } from "../types/commentType";
import { UserData } from "../types/userType";
import { userShow } from "../api/userApi";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";
import axios, { AxiosError } from "axios";
import { Button, Textarea } from "flowbite-react";

interface Props {
  comment: CommentData;
  onLike: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
}

const Comment: React.FC<Props> = ({
  comment,
  onLike,
  onEdit,
  onDelete,
}: Props) => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [user, setUser] = useState<UserData>();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user: UserData = await userShow(comment.userId);
        setUser(user);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };
    fetchData();
  }, [comment]);

  const handleEdit: React.MouseEventHandler<HTMLButtonElement> = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave: React.MouseEventHandler<HTMLButtonElement> = () => {
    onEdit(comment._id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="flex p-4 border-b border-gray-400 gap-2">
      {user ? (
        <>
          <img
            src={user.profilePicture}
            alt={user.username}
            className="w-10 h-10 rounded-full object-cover flex-0"
          />
          <div className="space-y-2 flex-1">
            <div className="text-xs space-x-1">
              <span className="font-bold">@{user.username}</span>
              <span className="font-light text-gray-500">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            {isEditing ? (
              <>
                <Textarea
                  placeholder="Leave a comment..."
                  rows={4}
                  required
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                ></Textarea>
                <div className="flex justify-end gap-2">
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                  <Button
                    gradientDuoTone="purpleToBlue"
                    size="sm"
                    outline
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="pb-1">{comment.content}</p>
                <div className="flex items-center gap-2 border-t border-gray-400 w-40 pt-1">
                  <button
                    onClick={() => onLike(comment._id)}
                    className={`text-sm ${
                      currentUser && comment.likes.includes(currentUser._id)
                        ? "text-blue-500 hover:text-gray-500"
                        : "text-gray-500 hover:text-blue-500"
                    }`}
                  >
                    <FaThumbsUp />
                  </button>
                  <p className="text-sm text-gray-400">
                    {comment.numberOfLikes > 0 &&
                      comment.numberOfLikes +
                        " " +
                        (comment.numberOfLikes === 1 ? "like" : "likes")}
                  </p>
                  {(currentUser?._id === comment.userId ||
                    currentUser?.isAdmin) && (
                    <>
                      <button
                        type="button"
                        className="text-sm text-gray-400 hover:text-blue-500"
                        onClick={handleEdit}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-sm text-gray-400 hover:text-red-500"
                        onClick={() => onDelete(comment._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comment;
