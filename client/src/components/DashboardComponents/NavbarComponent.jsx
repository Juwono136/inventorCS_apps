import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";

// icons and material-tailwind
import {
  Navbar,
  IconButton,
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  ListItemPrefix,
  Badge,
  Typography,
} from "@material-tailwind/react";
import { HiMenuAlt2 } from "react-icons/hi";
import {
  IoPersonCircleOutline,
  IoHome,
  IoNotificationsOutline,
  IoAlertCircleOutline,
} from "react-icons/io5";
import { CiPower } from "react-icons/ci";

// components
import SidebarComponent from "./SidebarComponent";
import DialogOpenComponent from "./DialogOpenComponent";

// features
import { logout, reset } from "../../features/auth/authSlice";
import { userReset } from "../../features/user/userSlice";
import {
  getNotificationByUser,
  markNotificationAsRead,
} from "../../features/notification/notificationSlice";

const NavbarComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuProfileOpen, setIsMenuProfileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { notification } = useSelector(
    (state) => state.notification.notifications
  );
  const { personal_info } = useSelector((state) => state.user.userInfor);
  const { avatar } = personal_info || "";

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const closeMenuProfile = () => setIsMenuProfileOpen(false);

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    dispatch(reset());
    dispatch(userReset());
    navigate("/signin");
  };

  const handleNotificationClick = (id, loanId) => {
    dispatch(markNotificationAsRead(id));

    if (user.selectedRole === 2) {
      navigate(`/user-loan/detail-loan/${loanId}`);
    } else {
      navigate(`/user-loan/detail/${loanId}`);
    }
  };

  useEffect(() => {
    dispatch(getNotificationByUser());
  }, [dispatch]);

  const unreadNotifications = Array.isArray(notification)
    ? notification.filter((notif) => !notif.is_read).slice(0, 5)
    : [];

  return (
    <>
      <Navbar className="sticky top-0 z-10 h-max max-w-full bg-gradient-to-r from-indigo-500 to-purple-800 px-2 py-3 rounded-none">
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
          <div className="flex items-center justify-center gap-2">
            <IconButton variant="text" size="lg" onClick={openDrawer}>
              <HiMenuAlt2 className="h-8 w-8 text-white" />
            </IconButton>
            <Link
              to="/dashboard"
              className="text-xs md:text-lg bg-gradient-to-r from-gray-100  to-blue-300 bg-clip-text text-transparent font-semibold mr-4 ml-2 cursor-pointer py-1.5 transition-all hover:text-gray-300"
            >
              InventorCS Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2 mx-3">
            <div className="px-4 hidden md:flex">
              <a
                href="/"
                className="flex items-center justify-center gap-2 bg-white text-indigo-500 text-xs font-semibold p-2 rounded-full transition-all hover:bg-indigo-100"
              >
                <IoHome />
                Home Page
              </a>
            </div>

            <Menu
              open={isMenuProfileOpen}
              handler={setIsMenuProfileOpen}
              placement="bottom-end"
            >
              <MenuHandler>
                <Button
                  variant="text"
                  color="blue-gray"
                  className="flex items-center rounded-full p-0"
                >
                  <Avatar
                    variant="circular"
                    size="sm"
                    alt="my_profile"
                    withBorder={true}
                    color="blue-gray"
                    className=" p-0.5"
                    src={avatar}
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-1" onClick={closeMenuProfile}>
                <MenuItem className="flex items-center gap-2 rounded">
                  <IoPersonCircleOutline className="h-4 w-4" strokeWidth={2} />
                  <Link to="/profile" className="text-sm">
                    My Profile
                  </Link>
                </MenuItem>

                <MenuItem
                  onClick={() => handleOpenDialog("xs")}
                  className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                >
                  <CiPower className="h-4 w-4 text-red-500" strokeWidth={2} />
                  <ListItemPrefix className="text-sm text-red-500">
                    Sign Out
                  </ListItemPrefix>
                </MenuItem>
              </MenuList>
            </Menu>

            {/* notification menu */}
            <Menu placement="bottom-end">
              <Badge
                color="red"
                invisible={unreadNotifications?.length > 0 ? false : true}
              >
                <MenuHandler>
                  <button className="bg-white rounded-full p-1.5 hover:bg-gray-300">
                    <IoNotificationsOutline className="text-xl text-indigo-900 font-semibold" />
                  </button>
                </MenuHandler>
              </Badge>
              <MenuList className="flex flex-col gap-2 max-w-max m-2 md:w-1/2 md:m-0">
                {unreadNotifications?.length > 0 ? (
                  unreadNotifications?.map((notif) => (
                    <MenuItem
                      key={notif._id}
                      onClick={() =>
                        handleNotificationClick(
                          notif._id,
                          notif.loan_transaction._id
                        )
                      }
                      className="flex items-start flex-col gap-4 py-2 pl-2 pr-8"
                    >
                      <div className="flex justify-center items-center gap-2">
                        <div className="flex items-center justify-center">
                          <IoAlertCircleOutline className="text-xl text-red-600" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <Typography
                            className={`text-xs md:text-sm text-gray-800 ${
                              notif.is_read ? "" : "font-bold"
                            }`}
                          >
                            {notif.message}
                          </Typography>
                          <Typography
                            variant="small"
                            color="gray"
                            className="text-xs"
                          >
                            {formatDistanceToNow(new Date(notif.createdAt), {
                              addSuffix: true,
                            })}
                          </Typography>
                        </div>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem className="flex items-center justify-center py-2">
                    <Typography variant="small" color="gray">
                      No new notifications.
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem>
                  <a
                    href="/notifications"
                    className=" text-xs text-indigo-700 hover:underline"
                  >
                    See more notifications
                  </a>
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
      </Navbar>
      <SidebarComponent isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} />

      {/* Dialog logout button */}
      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={handleLogout}
        handleOpenDialog={handleOpenDialog}
        message="Are you sure you want to log out?"
        btnText="Logout"
      />
    </>
  );
};

export default NavbarComponent;
