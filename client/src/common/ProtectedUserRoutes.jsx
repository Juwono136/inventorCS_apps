import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";

// features
import { logout } from "../features/auth/authSlice";

const UnauthorizedRedirect = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    toast.error("You are not authorized to access this page. Please Login!");
    dispatch(logout());
  }, [dispatch]);

  return <Navigate to="/signin" replace />;
};

const ProtectedUserRoutes = ({ children, allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  const isAuthorized = user && allowedRoles.includes(user.selectedRole);

  if (!isAuthorized) {
    return <UnauthorizedRedirect />;
  }

  return children;
};

export default ProtectedUserRoutes;
