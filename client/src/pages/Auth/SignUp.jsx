import React, { useEffect, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { reset, signup } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import { Spinner } from "@material-tailwind/react";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    binusian_id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isError: "",
    isSuccess: "",
  });

  const { binusian_id, name, email, password, confirmPassword } = formData;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success(user.message);
      dispatch(reset());
      setFormData({
        binusian_id: "",
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }

    if (user.isLoggedOut === false) {
      navigate("/dashboard");
    }
  }, [user, isError, isSuccess, message, dispatch, setFormData, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, isError: "", isSuccess: "" });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      binusian_id,
      name,
      email,
      password,
      confirmPassword,
    };

    dispatch(signup(userData));
    dispatch(reset());
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (isLoading || (user && !user.isLoggedOut)) {
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
            Join With Us Now
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label
                htmlFor="binusian_id"
                className="flex text-sm font-medium leading-6 text-gray-900"
              >
                Binusian ID
              </label>
              <div className="mt-2">
                <input
                  id="binusian_id"
                  name="binusian_id"
                  type="text"
                  value={binusian_id}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="name"
                className="flex text-sm font-medium leading-6 text-gray-900"
              >
                Your name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="name"
                  value={name}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="flex text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={onChange}
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  type={`${showPassword ? "text" : "password"}`}
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
                  value={confirmPassword}
                  onChange={onChange}
                  type="password"
                  className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <input
                type="submit"
                value="Sign Up"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Please Sign In?
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
