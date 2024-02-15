import React, { useEffect, useState } from "react";
import { postDestroy, postIndex } from "../api/postApi";
import { PostData, PostsResponse } from "../types/postType";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { CurrentUser } from "../types/authType";
import { RootState } from "../redux/store";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts: React.FC = () => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [userPosts, setUserPosts] = useState<PostData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [postId, setPostId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const res: PostsResponse = await postIndex({
            userId: currentUser._id,
          });
          setUserPosts(res.posts);
          setShowMore(res.totalPosts > 9 ? true : false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentUser]);

  const handleShowMore: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    if (currentUser) {
      setShowMore(false);
      try {
        const res: PostsResponse = await postIndex({
          userId: currentUser._id,
          skip: userPosts.length,
        });

        setUserPosts((prev) => [...prev, ...res.posts]);
        res.posts.length <= 9 ? setShowMore(false) : setShowMore(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePostDestroy: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    setShowModal(false);
    if (currentUser) {
      try {
        await postDestroy(postId);
        setUserPosts((prev) => prev.filter((post) => post._id !== postId));
      } catch (error) {
        console.log(error);
      }
    }
  };
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
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className="font-medium text-cyan-600 hover:underline hover:cursor-pointer dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setPostId(post._id);
                    }}
                    className="font-medium text-red-600 hover:underline hover:cursor-pointer dark:text-red-500"
                  >
                    Delete
                  </span>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
      {showMore && (
        <button
          onClick={handleShowMore}
          className="w-full rounded-xl mt-3 p-2 text-blue-700 dark:text-blue-600 font-medium hover:ring hover:ring-2"
        >
          Show more
        </button>
      )}
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
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handlePostDestroy}>
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

export default DashPosts;
