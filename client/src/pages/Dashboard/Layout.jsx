import React from "react";
import SidebarDashboard from "../../components/SidebarDashboard";
import NavbarDashboard from "../../components/NavbarDashboard";

const Layout = ({ children }) => {
  return (
    <>
      <div>
        <SidebarDashboard />
        <div>
          <NavbarDashboard />
          <main>{children}</main>
        </div>
      </div>
    </>
  );
};

export default Layout;
