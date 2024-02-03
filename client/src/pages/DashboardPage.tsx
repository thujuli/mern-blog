import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";

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
        <DashSidebar />
        {/* profile */}
        {tab === "profile" && <DashProfile />}
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
