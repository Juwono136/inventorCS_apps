import React, { useEffect } from "react";
import SidebarDashboard from "../../components/SidebarDashboard";
import NavbarDashboard from "../../components/NavbarDashboard";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";

const Layout = ({ children }) => {
  const { user, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.isLoggedOut) {
      navigate("/signin");
    }
  }, [user, navigate]);

  if (isLoading || (user && user.isLoggedOut)) {
    return (
      <div className="grid h-screen place-items-center">
        <Spinner className="h-16 w-16 text-indigo-900/50" />
      </div>
    );
  }

  return (
    <>
      <div className="flex">
        <SidebarDashboard />
        <div className="w-full">
          <NavbarDashboard />
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
