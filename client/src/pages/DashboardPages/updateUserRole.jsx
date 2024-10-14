import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import BackButton from "../../common/BackButton";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
} from "@material-tailwind/react";
import SocialComponent from "../../components/DashboardComponents/SocialComponent";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../common/Loader";
import {
  updateUserRole,
  updateUserStatus,
} from "../../features/user/userSlice";
import { accessToken } from "../../features/token/tokenSlice";
import toast from "react-hot-toast";
import DialogOpenComponent from "../../components/DashboardComponents/DialogOpenComponent";

const UpdateUserRole = () => {
  const roleMap = {
    0: "User",
    1: "Admin",
    2: "Staff",
  };

  const userStatus = ["active", "inactive"];

  const initialState = {
    role: [],
    status: "",
  };

  const { id } = useParams();
  const { allUsersInfor, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.user
  );

  const { users } = allUsersInfor;
  const foundUser = users?.find((user) => user._id === id);
  // console.log(foundUser);

  useEffect(() => {
    if (foundUser) {
      setSelectedUser({
        role: foundUser?.personal_info.role || [],
        status: foundUser?.personal_info.status,
      });
    }
  }, [foundUser]);

  const [userDetail, setUserDetail] = useState(null);
  const [selectedUser, setSelectedUser] = useState(initialState);
  const [openDialogSave, setOpenDialogSave] = useState(false);
  const [isRoleChanged, setIsRoleChanged] = useState(false);
  const [isStatusChanged, setIsStatusChanged] = useState(false);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const { role, status } = selectedUser;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRoleChange = (e, index) => {
    const { value } = e.target;
    const updatedRoles = [...selectedUser.role];
    updatedRoles[index] = parseInt(value);

    setSelectedUser({
      ...selectedUser,
      role: updatedRoles,
    });

    setIsRoleChanged(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setSelectedUser({
        ...selectedUser,
        status: value,
      });
      setIsStatusChanged(true);
    }
  };

  const handleOpenDialogSave = () => {
    setOpenDialogSave(!openDialogSave);
  };

  const handleUpdateRole = (e) => {
    e.preventDefault();

    const updatedData = {
      _id: id,
      role: selectedUser.role,
    };

    dispatch(updateUserRole(updatedData)).then((res) => {
      dispatch(accessToken(res));
    });

    if (isSuccess) {
      toast.success(message);
    }

    setOpenDialogSave(!openDialogSave);
  };

  const handleUpdateStatus = (e) => {
    e.preventDefault();

    const updatedData = {
      _id: id,
      status: selectedUser.status,
    };

    dispatch(updateUserStatus(updatedData)).then((res) => {
      dispatch(accessToken(res));
    });

    if (isSuccess) {
      toast.success(message);
    }

    setOpenDialogSave(!openDialogSave);
  };

  const handleSave = (e) => {
    // e.preventDefault();

    if (isRoleChanged) {
      handleUpdateRole(e);
    }

    if (isStatusChanged) {
      handleUpdateStatus(e);
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error(message);
      navigate(`/users/update_user/${foundUser._id}`);
    }

    if (isSuccess) {
      toast.success(message);
      navigate(`/users/update_user/${foundUser._id}`);
    }

    if (users) {
      setUserDetail(foundUser);
      // setSelectedRole(foundUser?.personal_info.role);
    }

    const isChanged =
      selectedUser.role !== foundUser?.personal_info.role ||
      selectedUser.status !== foundUser?.personal_info.status;

    setIsSaveDisabled(!isChanged);
  }, [users, selectedUser, foundUser, isError, message, isSuccess, navigate]);

  return (
    <Layout>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="flex items-center">
            <BackButton link="/users" />
          </div>

          <div className="flex w-full justify-between items-center">
            <h3 className="text-base font-bold text-indigo-500/60 pointer-events-none sm:text-xl">
              Update User
            </h3>
          </div>

          <hr className="w-full border-indigo-100 my-4" />

          <div className="flex flex-col items-start px-5 py-4 my-2 w-full shadow-lg shadow-gray-300 rounded-md">
            <div className="flex w-full gap-4 flex-col lg:flex-row mb-4">
              {/* user summary info */}
              <Card className="flex basis-1/2 gap-2 flex-col w-full items-center justify-start shadow-lg bg-indigo-50/40">
                <CardHeader className="shrink-0 mt-8">
                  <Avatar
                    src={userDetail?.personal_info.avatar}
                    alt="avatar"
                    size="xxl"
                    variant="rounded"
                    withBorder={true}
                    className="p-0.5"
                  />
                </CardHeader>

                <CardBody className="text-center flex flex-col gap-2 p-2">
                  <h1 className="text-indigo-800 text-sm">
                    {userDetail?.personal_info.name}
                  </h1>

                  <p className="text-indigo-600 text-xs">
                    {userDetail?.personal_info.email}
                  </p>

                  {role?.map((r, index) => (
                    <Chip
                      key={index}
                      variant="ghost"
                      size="sm"
                      value={roleMap[r]}
                      color={r === 1 ? "green" : r === 2 ? "orange" : "blue"}
                    />
                  ))}
                </CardBody>

                <div>
                  <SocialComponent
                    social_links={userDetail?.social_links}
                    joinedAt={userDetail?.joinedAt}
                  />
                </div>
              </Card>

              {/* user detail info */}
              <div className="flex gap-4 w-full p-4 flex-col bg-indigo-50 rounded-md shadow-lg">
                {/* change user role */}
                {selectedUser?.role?.map((roleValue, index) => (
                  <div className="mb-2" key={index}>
                    <label
                      htmlFor={`role-${index}`}
                      className="block text-sm font-semibold text-purple-800"
                    >
                      Change User Role-{index + 1}:
                    </label>

                    {/* Loop through user roles to create a select option for each role */}
                    <div className="flex flex-col gap-4">
                      <select
                        key={index}
                        id={`role-${index}`}
                        name="role"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-indigo-800 border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-lg"
                        value={roleValue}
                        onChange={(e) => handleRoleChange(e, index)} // Adjust to handle role change for specific index
                      >
                        {Object.entries(roleMap).map(([key, value]) => (
                          <option
                            key={key}
                            value={key}
                            className="text-indigo-800"
                          >
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {/* change user role */}
                <div className="mb-2">
                  <label
                    htmlFor="userStatus"
                    className="block text-sm font-semibold text-red-700"
                  >
                    Change User Status:
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base text-red-800 border-gray-300 focus:outline-none focus:ring-read-500 focus:border-red-500 sm:text-sm rounded-md shadow-lg"
                    value={status}
                    onChange={handleChange}
                  >
                    {userStatus.map((status, index) => (
                      <option
                        key={index}
                        value={status}
                        className="text-red-800"
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-1 flex-col flex-wrap">
                  <h1 className="text-sm text-indigo-800">Binusian ID:</h1>
                  <p className="text-sm text-indigo-500">
                    {userDetail?.personal_info.binusian_id}
                  </p>
                </div>

                <div className="flex gap-1 flex-col flex-wrap">
                  <h1 className="text-sm text-indigo-800">Program:</h1>
                  <p className="text-sm text-indigo-500">
                    {userDetail?.personal_info.program}
                  </p>
                </div>

                <div className="flex gap-1 flex-col flex-wrap">
                  <h1 className="text-sm text-indigo-800">Phone Number:</h1>
                  {userDetail?.personal_info.phone.length ? (
                    <p className="text-sm text-indigo-500">
                      {userDetail?.personal_info.phone}
                    </p>
                  ) : (
                    <p className="text-sm text-indigo-500">-</p>
                  )}
                </div>

                <div className="flex gap-1 flex-col flex-wrap">
                  <h1 className="text-sm text-indigo-800">Address:</h1>
                  {userDetail?.personal_info.address.length ? (
                    <p className="text-sm text-indigo-500">
                      {userDetail?.personal_info.address}
                    </p>
                  ) : (
                    <p className="text-sm text-indigo-500">-</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-center md:justify-start text-white">
              <Button
                className="bg-gradient-to-r from-indigo-500 to-purple-800 text-sm py-2 px-8 rounded-lg capitalize"
                onClick={() => handleOpenDialogSave("xs")}
                disabled={isSaveDisabled}
              >
                Save
              </Button>
            </div>
          </div>
        </>
      )}

      {/* save user open dialog */}
      <DialogOpenComponent
        openDialog={openDialogSave}
        handleFunc={handleSave}
        handleOpenDialog={handleOpenDialogSave}
        message="Save update user?"
        btnText="Save"
      />
    </Layout>
  );
};

export default UpdateUserRole;
