import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { activateMail } from "../../features/auth/authSlice";

const ActivationEmail = () => {
  const { token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(activateMail(token));
    }
  }, [token, dispatch]);

  return (
    <div className="bg-indigo-600 px-4 py-3 text-white">
      <p className="text-center text-sm font-medium">
        Register Accounts Successfully.{" "}
        <a href="/signin" className="inline-block underline">
          Please Login Now!
        </a>
      </p>
    </div>
  );
};

export default ActivationEmail;
