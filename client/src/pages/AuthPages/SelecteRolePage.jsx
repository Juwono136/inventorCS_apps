import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// icons and material-tailwind
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { LuUsers } from "react-icons/lu";
import { CiPower } from "react-icons/ci";

// components
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";
import Loader from "../../common/Loader";

// features
import { logout, reset, selectRole } from "../../features/auth/authSlice";
import { userReset } from "../../features/user/userSlice";

const SelecteRolePage = () => {
  const { user, isError, message, isLoggedOut, isLoading } = useSelector(
    (state) => state.auth
  );
  const [selectedRole, setSelectedRole] = useState(null);
  const [openDialogLogout, setOpenDialogLogout] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleOpenDialogLogout = () => {
    setOpenDialogLogout(!openDialogLogout);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    dispatch(reset());
    dispatch(userReset());
    navigate("/signin");
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
    <div className="relative flex items-center justify-center h-screen mx-6 md:mx-0">
      <div className="absolute top-0 right-0 my-6 mx-0 md:mx-8 text-white">
        <Button
          variant="gradient"
          color="red"
          className="flex gap-1 px-3 py-2"
          onClick={() => handleOpenDialogLogout("xs")}
        >
          <CiPower className="h-4 w-4" strokeWidth={2} />
          Log out
        </Button>
      </div>
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

      {/* Dialog logout */}
      <DialogOpenComponent
        openDialog={openDialogLogout}
        handleFunc={handleLogout}
        handleOpenDialog={handleOpenDialogLogout}
        message="Are you sure you want to log out?"
        btnText="Logout"
      />
    </div>
  );
};

export default SelecteRolePage;
