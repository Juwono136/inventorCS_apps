import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedUserRoutes = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  // console.log("Current User Role:", user?.selectedRole);

  if (
    !user ||
    !typeof user?.selectedRole ||
    !allowedRoles.includes(user?.selectedRole)
  ) {
    return <Navigate to="404" />;
  }

  return children;
};

export default ProtectedUserRoutes;
