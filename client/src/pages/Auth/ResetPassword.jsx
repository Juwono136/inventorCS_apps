import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { reset, resetPassword } from "../../features/auth/authSlice";
import { Spinner } from "@material-tailwind/react";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });

  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { password, confirmPassword } = data;
  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(user.message);
    }

    if (user.isLoggedOut === false) {
      navigate("/");
    }
  }, [user, isError, isSuccess, message, dispatch, navigate]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, isError: "", isSuccess: "" });
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    const resetPass = { data, token };

    dispatch(resetPassword(resetPass));
    dispatch(reset());
    setData({ password: "", confirmPassword: "" });
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading) {
    return (
      <div className="grid h-screen place-items-center">
        <Spinner className="h-16 w-16 text-indigo-900/50" />
      </div>
    );
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset Password
          </h2>
          <p className="text-center text-sm leading-9 tracking-tight text-gray-900">
            Please Reset your password for recorvery
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  New Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={`${showPassword ? "text" : "password"}`}
                  value={password}
                  onChange={handleChangeInput}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />

                <div onClick={handleShowPassword}>
                  {!showPassword ? (
                    <FaRegEyeSlash className="absolute top-2 right-2 px-1 cursor-pointer text-2xl text-gray-900 hover:text-indigo-500" />
                  ) : (
                    <FaRegEye className="absolute top-2 right-2 px-1 cursor-pointer text-2xl text-gray-900 hover:text-indigo-500" />
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Confirm Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={handleChangeInput}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <input
                type="submit"
                value="Update Password"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
