import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { forgotPassword, reset } from "../../features/auth/authSlice";
import Loader from "../../common/Loader";

const ForgotPasswordPage = () => {
  const [data, setData] = useState({
    email: "",
  });

  const { email } = data;
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, isLoggedOut, message } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isSuccess) {
      toast.success(user.message);
      setData({ email: "" });
    }
  }, [user, isSuccess, isError, message, dispatch, setData]);

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, isError: "", isSuccess: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const userEmail = {
      email,
    };

    dispatch(forgotPassword(userEmail));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      {user && isLoggedOut === false ? (
        <Navigate to="/dashboard" />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Forgot Password?
            </h2>
            <p className="text-center text-sm leading-9 tracking-tight text-gray-900">
              Please verify your email
            </p>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="flex text-sm font-medium leading-6 text-gray-900"
                >
                  Your Email
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={handleChangeInput}
                    placeholder="Email"
                    className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <input
                  type="submit"
                  value="Verify my email"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ForgotPasswordPage;
