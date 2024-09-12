import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
} from "@material-tailwind/react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiPower } from "react-icons/ci";
import { IoHome } from "react-icons/io5";
import SidebarComponent from "./SidebarComponent";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import DialogOpenComponent from "./DialogOpenComponent";
import { userReset } from "../../features/user/userSlice";

const NavbarComponent = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuProfileOpen, setIsMenuProfileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  return (
    <>
      <Navbar className="sticky top-0 z-10 h-max max-w-full bg-gradient-to-r from-indigo-500 to-purple-800 px-4 py-3 rounded-none">
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
          <div className="flex items-center justify-center gap-2">
            <IconButton variant="text" size="lg" onClick={openDrawer}>
              <HiMenuAlt2 className="h-8 w-8 text-white" />
            </IconButton>
            <Link
              to="/dashboard"
              className="text-sm md:text-lg bg-gradient-to-r from-gray-100  to-blue-300 bg-clip-text text-transparent font-semibold mr-4 ml-2 cursor-pointer py-1.5 transition-all hover:text-gray-300"
            >
              InventorCS Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2 mx-3">
            <div className="px-4 hidden md:flex">
              <Link
                to="/"
                target={"_blank"}
                className="flex items-center justify-center gap-2 bg-white text-indigo-500 text-xs font-semibold p-2 rounded-full transition-all hover:bg-indigo-100"
              >
                <IoHome />
                See Home Page
              </Link>
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
