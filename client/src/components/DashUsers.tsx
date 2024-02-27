import React, { useEffect, useState } from "react";
import { Button, Modal, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import { CurrentUser } from "../types/authType";
import { RootState } from "../redux/store";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { UserData, UsersResponse } from "../types/userType";
import { userDestroy, userIndex } from "../api/userApi";
import { FaCheck, FaTimes } from "react-icons/fa";
import axios, { AxiosError } from "axios";

const DashUsers: React.FC = () => {
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const [users, setUsers] = useState<UserData[]>([]);
  const [showMore, setShowMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (currentUser) {
          const res: UsersResponse = await userIndex({});
          setUsers(res.users);
          setShowMore(res.totalUsers > 9 ? true : false);
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
        const res: UsersResponse = await userIndex({
          skip: users.length,
        });

        setUsers((prev) => [...prev, ...res.users]);
        res.users.length <= 9 ? setShowMore(false) : setShowMore(true);
      } catch (error) {
        const err = error as AxiosError | Error;
        axios.isAxiosError(err)
          ? console.error(err.response?.data?.message)
          : console.error(err.message);
      }
    }
  };

  const handleUserDestroy: React.MouseEventHandler<
    HTMLButtonElement
  > = async () => {
    setShowModal(false);
    if (currentUser) {
      try {
        await userDestroy(userId);
        setUsers((prev) => prev.filter((user) => user._id !== userId));
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
      {currentUser?.isAdmin && users.length > 0 && (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>username</Table.HeadCell>
            <Table.HeadCell>email</Table.HeadCell>
            <Table.HeadCell>admin</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row
                key={user._id}
                className="bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <Table.Cell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Table.Cell>
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
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </Table.Cell>
                <Table.Cell>
                  <span
                    onClick={() => {
                      setShowModal(true);
                      setUserId(user._id);
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
              <Button color="failure" onClick={handleUserDestroy}>
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

export default DashUsers;
