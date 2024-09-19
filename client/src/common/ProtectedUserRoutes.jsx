import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedUserRoutes = ({ children, allowedRoles }) => {
  const { userInfor } = useSelector((state) => state.user);

  if (!userInfor || !allowedRoles.includes(userInfor?.personal_info.role)) {
    return <Navigate to="*" />;
  }

  return children;
};

export default ProtectedUserRoutes;
