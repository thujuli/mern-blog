import React, { useEffect, useState } from "react";
import moment from "moment";
import { CommentData } from "../types/commentType";
import { UserData } from "../types/userType";
import { userShow } from "../api/userApi";

interface Props {
  comment: CommentData;
}

const Comment: React.FC<Props> = ({ comment }: Props) => {
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
            <p>{comment.content}</p>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default Comment;
