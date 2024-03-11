import React, { useEffect, useState } from "react";
import {
  HiArrowNarrowUp,
  HiOutlineChat,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { UserData, UsersResponse } from "../types/userType";
import { CommentData, CommentsResponse } from "../types/commentType";
import { PostData, PostsResponse } from "../types/postType";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";
import axios, { AxiosError } from "axios";
import { userIndex } from "../api/userApi";
import { commentIndex } from "../api/commentApi";
import { postIndex } from "../api/postApi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

const DashComponent: React.FC = () => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [users, setUsers] = useState<UserData[]>([]);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [totalLastMonthUsers, setTotalLastMonthUsers] = useState<number>(0);
  const [totalLastMonthComments, setTotalLastMonthComments] =
    useState<number>(0);
  const [totalLastMonthPosts, setTotalLastMonthPosts] = useState<number>(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res: UsersResponse = await userIndex({ limit: 5 });
        setUsers(res.users);
        setTotalUsers(res.totalUsers);
        setTotalLastMonthUsers(res.totalLastMonthUsers);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res: CommentsResponse = await commentIndex({ limit: 5 });
        setComments(res.comments);
        setTotalComments(res.totalComments);
        setTotalLastMonthComments(res.totalLastMonthComments);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res: PostsResponse = await postIndex({ limit: 5 });
        setPosts(res.posts);
        setTotalPosts(res.totalPosts);
        setTotalLastMonthPosts(res.totalLastMonthPosts);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    };

    if (currentUser && currentUser.isAdmin) {
      fetchUsers();
      fetchComments();
      fetchPosts();
    }
  }, [currentUser]);
  return (
    <div className="p-3 mx-auto">
      <div className="flex flex-wrap justify-center gap-4">
        <div className="flex justify-between w-full md:w-80 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <div className="flex-1">
            <h3 className="text-gray-600 dark:text-gray-300 uppercase">
              Total Users
            </h3>
            <p className="text-4xl">{totalUsers}</p>
            <div className="flex items-center mt-4">
              <HiArrowNarrowUp className="text-green-500 text-sm" />
              <p className="text-green-500 text-sm mr-2">
                {totalLastMonthUsers}
              </p>
              <p>Last Month</p>
            </div>
          </div>
          <div className="flex-0">
            <HiOutlineUserGroup className="p-2 bg-teal-600 rounded-full text-4xl text-white" />
          </div>
        </div>
        <div className="flex justify-between w-full md:w-80 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <div className="flex-1">
            <h3 className="text-gray-600 dark:text-gray-300 uppercase">
              Total Comments
            </h3>
            <p className="text-4xl">{totalComments}</p>
            <div className="flex items-center mt-4">
              <HiArrowNarrowUp className="text-green-500 text-sm" />
              <p className="text-green-500 text-sm mr-2">
                {totalLastMonthComments}
              </p>
              <p>Last Month</p>
            </div>
          </div>
          <div className="flex-0">
            <HiOutlineChat className="p-2 bg-indigo-600 rounded-full text-4xl text-white" />
          </div>
        </div>
        <div className="flex justify-between w-full md:w-80 p-2 rounded-lg bg-gray-50 dark:bg-gray-800 shadow-md">
          <div className="flex-1">
            <h3 className="text-gray-600 dark:text-gray-300 uppercase">
              Total Posts
            </h3>
            <p className="text-4xl">{totalPosts}</p>
            <div className="flex items-center mt-4">
              <HiArrowNarrowUp className="text-green-500 text-sm" />
              <p className="text-green-500 text-sm mr-2">
                {totalLastMonthPosts}
              </p>
              <p>Last Month</p>
            </div>
          </div>
          <div className="flex-0">
            <HiOutlineDocumentText className="p-2 bg-lime-600 rounded-full text-4xl text-white" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 justify-center mt-5">
        <div className="min-w-full md:min-w-80 md:max-w-96">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Recent users</p>
            <Link to="/dashboard?tab=users">
              <Button size="sm" gradientDuoTone="purpleToPink" outline>
                See all
              </Button>
            </Link>
          </div>
          <Table hoverable className="rounded-xl shadow-md">
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>username</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </Table.Cell>
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {user.username}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="min-w-full md:min-w-80">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Recent comments</p>
            <Link to="/dashboard?tab=comments">
              <Button size="sm" gradientDuoTone="purpleToPink" outline>
                See all
              </Button>
            </Link>
          </div>
          <Table hoverable className="rounded-xl shadow-md">
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>likes</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {comments.map((comment) => (
                <Table.Row
                  key={comment._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <p className="max-w-96 line-clamp-2">{comment.content}</p>
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    {comment.numberOfLikes}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
        <div className="min-w-full md:min-w-80">
          <div className="flex justify-between items-center mb-2">
            <p className="font-medium">Recent Posts</p>
            <Link to="/dashboard?tab=posts">
              <Button size="sm" gradientDuoTone="purpleToPink" outline>
                See all
              </Button>
            </Link>
          </div>
          <Table hoverable className="rounded-xl shadow-md">
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              <Table.HeadCell>Post Category</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {posts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-14 h-10 object-cover bg-gray-500 rounded-md"
                    />
                  </Table.Cell>
                  <Table.Cell className="font-medium text-gray-900 dark:text-white">
                    <p className="max-w-96 line-clamp-2">{post.title}</p>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashComponent;
