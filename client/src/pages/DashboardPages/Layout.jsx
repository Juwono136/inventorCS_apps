import React from "react";
import SidebarComponent from "../../components/DashboardComponents/SidebarComponent";
import NavbarComponent from "../../components/DashboardComponents/NavbarComponent";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../../common/Loader";

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
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />
      <div className="flex flex-col flex-grow overflow-hidden">
        <NavbarComponent />
        <main className="flex-grow overflow-x-auto px-6 py-4">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
