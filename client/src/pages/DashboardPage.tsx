import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashUsers from "../components/DashUsers";
import DashComments from "../components/DashComments";
import DashComponent from "../components/DashComponent";

const DashboardPage: React.FC = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <MainLayout>
      <div className="min-h-screen flex flex-col sm:flex-row">
        {/* sidebar */}
        <div>
          <DashSidebar />
        </div>
        {/* profile */}
        {tab === "profile" && <DashProfile />}
        {/* posts */}
        {tab === "posts" && <DashPosts />}
        {/* users */}
        {tab === "users" && <DashUsers />}
        {/* comments */}
        {tab === "comments" && <DashComments />}
        {/* comments */}
        {tab === "dash" && <DashComponent />}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
