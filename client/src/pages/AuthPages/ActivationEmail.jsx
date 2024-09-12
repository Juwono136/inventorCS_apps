import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useParams } from "react-router-dom";
import { activateMail } from "../../features/auth/authSlice";

const ActivationEmail = () => {
  const { token } = useParams();
  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(activateMail(token));
    }
  }, [token, dispatch]);

  return (
    <>
      {user && isLoggedOut === false ? (
        <Navigate to="/dashboard" />
      ) : (
        <div className="bg-indigo-600 px-4 py-3 text-white">
          <p className="text-center text-sm font-medium">
            Register Accounts Successfully.{" "}
            <a href="/signin" className="inline-block underline">
              Click to login
            </a>
          </p>
        </div>
      )}
    </>
  );
};

export default ActivationEmail;
