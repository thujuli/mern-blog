import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { CurrentUser } from "../types/authType";
import { RootState } from "../redux/store";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios, { AxiosError } from "axios";
import { CommentData, CommentsResponse } from "../types/commentType";
import { commentDestroy, commentIndex } from "../api/commentApi";

const DashComments: React.FC = () => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [comments, setComments] = useState<CommentData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [commentId, setCommentId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const res: CommentsResponse = await commentIndex({});
          setComments(res.comments);
          setShowMore(res.totalComments > 9 ? true : false);
        }
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
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
        const res: CommentsResponse = await commentIndex({
          skip: comments.length,
        });

        setComments((prev) => [...prev, ...res.comments]);
        res.comments.length <= 9 ? setShowMore(false) : setShowMore(true);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    }
  };

  const handleCommentDestroy: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    setShowModal(false);
    if (currentUser) {
      try {
        await commentDestroy(commentId);
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentId)
        );
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    }
  };

  return (
    <div className="overflow-x-auto mx-auto p-4">
      {currentUser?.isAdmin && comments.length > 0 && (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Comment content</Table.HeadCell>
            <Table.HeadCell>Number of likes</Table.HeadCell>
            <Table.HeadCell>PostId</Table.HeadCell>
            <Table.HeadCell>UserId</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {comments.map((comment) => (
              <Table.Row
                key={comment._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(comment.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell className="text-gray-900 dark:text-white">
                  {comment.content}
                </Table.Cell>
                <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                <Table.Cell>{comment.postId}</Table.Cell>
                <Table.Cell>{comment.userId}</Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setCommentId(comment._id);
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

export default DashComments;
