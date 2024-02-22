import React, { useEffect, useState } from "react";
import moment from "moment";
import { CommentData } from "../types/commentType";
import { UserData } from "../types/userType";
import { userShow } from "../api/userApi";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";

interface Props {
  comment: CommentData;
  onLike: (commentId: string) => void;
}

const Comment: React.FC<Props> = ({ comment, onLike }: Props) => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [user, setUser] = useState<UserData>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user: UserData = await userShow(comment.userId);
        setUser(user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [comment]);

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
            <p className="pb-1">{comment.content}</p>
            <div className="flex items-center gap-2 border-t border-gray-400 w-20 pt-1">
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
              <span className="text-sm text-gray-400 leading-none">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </span>
            </div>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comment;
