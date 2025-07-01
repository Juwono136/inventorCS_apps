import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// components
import SidebarComponent from "../../components/DashboardComponents/SidebarComponent";
import NavbarComponent from "../../components/DashboardComponents/NavbarComponent";
import Loader from "../../common/Loader";
import FooterDashboardComponent from "../../components/DashboardComponents/FooterDashboardComponent";
import ScrollUp from "../../common/ScrollUp";

const Layout = ({ children }) => {
  const { user, isLoggedOut, isLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return <Loader />;
  }

  if (!user && isLoggedOut === true) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user && user.role) {
    return <Navigate to="/select-role" state={{ from: location }} replace />;
  }

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <SidebarComponent />
        <div className="flex flex-col flex-grow overflow-hidden">
          <NavbarComponent />
          <main className="flex-grow overflow-x-auto px-6 py-4">{children}</main>
        </div>
      </div>
      <FooterDashboardComponent />
      <ScrollUp />
    </>
  );
};

export default Layout;
