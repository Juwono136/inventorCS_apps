import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedUserRoutes = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (
    !user ||
    !user.selectedRole ||
    !allowedRoles.includes(user.selectedRole)
  ) {
    return <Navigate to="*" />;
  }

  return children;
};

export default ProtectedUserRoutes;
