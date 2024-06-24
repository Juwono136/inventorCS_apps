import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { reset, signin } from "../../features/auth/authSlice";
import { Spinner } from "@material-tailwind/react";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isError: "",
    isSuccess: "",
  });
  const { email, password } = formData;
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
    }

    if (!user.isLoggedOut) {
      navigate("/dashboard");
    }

    // if (user.isLoggedOut) {
    //   toast.success(user.message);
    // }
  }, [user, isError, isSuccess, message, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, isError: "", isSuccess: "" });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
    };

    dispatch(signin(userData));
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
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
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
                  placeholder="Email"
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
                <div className="text-sm">
                  <a
                    href="/forgot"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  value={password}
                  onChange={onChange}
                  type={`${showPassword ? "text" : "password"}`}
                  placeholder="Password"
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
              <input
                type="submit"
                value="Sign in"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm cursor-pointer hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            If you don't have an account,{" "}
            <a
              href="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Please Sign Up.
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
