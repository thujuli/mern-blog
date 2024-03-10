import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiUserGroup,
} from "react-icons/hi";
import { BiSolidCommentDetail } from "react-icons/bi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutDestroy } from "../api/authApi";
import { logoutSuccess } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { CurrentUser } from "../types/authType";

const DashSidebar: React.FC = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser }: { currentUser: CurrentUser } = useSelector(
    (state: RootState) => state.auth
  );
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleLogout: React.MouseEventHandler<HTMLDivElement> = async () => {
    await logoutDestroy();
    dispatch(logoutSuccess());
    navigate("/login");
  };
  return (
    <Sidebar className="grow-0 w-full sm:w-64">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              icon={HiUser}
              label={currentUser?.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              active={tab === "profile"}
              as="span"
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                icon={HiDocumentText}
                active={tab === "posts"}
                as="span"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=users">
              <Sidebar.Item
                icon={HiUserGroup}
                active={tab === "users"}
                as="span"
              >
                Users
              </Sidebar.Item>
            </Link>
          )}
          {currentUser?.isAdmin && (
            <Link to="/dashboard?tab=comments">
              <Sidebar.Item
                icon={BiSolidCommentDetail}
                active={tab === "comments"}
                as="span"
              >
                Comments
              </Sidebar.Item>
            </Link>
          )}
          <div onClick={handleLogout}>
            <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
              Logout
            </Sidebar.Item>
          </div>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
