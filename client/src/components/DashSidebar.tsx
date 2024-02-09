import { Sidebar } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutDestroy } from "../api/authApi";
import { logoutSuccess } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const DashSidebar: React.FC = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
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
      <Sidebar.Items className="sm:min-h-screen">
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              icon={HiUser}
              label="User"
              labelColor="dark"
              active={tab === "profile"}
              as="span"
            >
              Profile
            </Sidebar.Item>
          </Link>
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
