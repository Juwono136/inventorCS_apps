import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { reset, selectRole } from "../../features/auth/authSlice";
import toast from "react-hot-toast";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { LuUsers } from "react-icons/lu";
import Loader from "../../common/Loader";

const SelecteRolePage = () => {
  const { user, isError, message, isLoggedOut, isLoading } = useSelector(
    (state) => state.auth
  );
  const [selectedRole, setSelectedRole] = useState(null);
  const dispatch = useDispatch();

  const roles = user?.role || [];
  const roleOptions = {
    0: "User",
    1: "Admin",
    2: "Staff",
  };

  const handleRoleSelect = (role) => {
    const selectedRole = parseInt(role);
    setSelectedRole(selectedRole);
  };

  const handleContinue = (e) => {
    e.preventDefault();

    const userId = user?.id;
    dispatch(selectRole({ userId, selectedRole }));

    toast.success("🖖Welcome!");
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }
  }, [isError, message, dispatch]);

  if (!user && isLoggedOut === true) {
    return <Navigate to="/signin" />;
  }

  if (user && !user.role) {
    return <Navigate to="/dashboard" />;
  }

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center h-screen mx-6 md:mx-0">
      <Card className="w-96">
        <CardHeader
          variant="gradient"
          className="mb-4 grid bg-gradient-to-r from-indigo-500 to-purple-800 py-4 place-items-center"
        >
          <LuUsers className="text-gray-100 text-4xl mb-1 " />
          <Typography className="text-gray-100 text-base font-semibold">
            Select your role to continue:
          </Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4">
          <div className="flex w-full">
            <p className="text-xs text-center text-red-500 italic">
              Your account has more than one role. Please specify your role
              before proceeding.{" "}
            </p>
          </div>

          <div className="flex gap-4 w-full justify-center items-center max-h-full py-2">
            {roles.map((role) => (
              <Button
                key={role}
                color="indigo"
                variant={selectedRole === role ? "gradient" : "outlined"}
                className={`w-max py-2 rounded-full ${
                  selectedRole === role
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600 bg-indigo-50"
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                {roleOptions[role]}
              </Button>
            ))}
          </div>
        </CardBody>
        <CardFooter className="pt-0">
          <Button
            className="bg-indigo-800"
            fullWidth
            onClick={handleContinue}
            disabled={selectedRole === null}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SelecteRolePage;
