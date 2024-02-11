import React, { useEffect, useState } from "react";
import { postIndex } from "../api/postApi";
import { PostData, PostsResponse } from "../types/postType";
import { Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { CurrentUser } from "../types/authType";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";

const DashPosts: React.FC = () => {
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const res: PostsResponse = await postIndex(currentUser._id);
          setUserPosts(res.posts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentUser]);
  return (
    <div className="overflow-x-auto mx-auto p-4">
      {currentUser?.isAdmin && userPosts.length > 0 && (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Post image</Table.HeadCell>
            <Table.HeadCell>Post title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Edit</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {userPosts.map((post) => (
              <Table.Row
                key={post._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(post.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/posts/${post.slug}`}>
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-20 h-10 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {post.title}
                </Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-cyan-600 hover:underline hover:cursor-pointer dark:text-cyan-500">
                    Edit
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <span className="font-medium text-red-600 hover:underline hover:cursor-pointer dark:text-red-500">
                    Delete
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default DashPosts;
