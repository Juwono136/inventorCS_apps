import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  Drawer,
  Card,
  Dialog,
} from "@material-tailwind/react";
import { IoClose, IoSettingsOutline } from "react-icons/io5";
import { FaPowerOff } from "react-icons/fa";
import { MdOutlineInventory2 } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { LuUserCog } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import logoImg from "../../assets/images/logo.png";
import DialogOpenComponent from "./DialogOpenComponent";
import { userReset } from "../../features/user/userSlice";

const SidebarComponent = ({ isDrawerOpen = false, closeDrawer }) => {
  const overlayRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { userInfor } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const getNavLinkClass = ({ isActive }) =>
    `flex gap-2 items-center text-indigo-800 ${isActive ? "font-bold" : ""}`;

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/signin");
    dispatch(reset());
    dispatch(userReset());
  };

  return (
    <>
      <Drawer
        open={isDrawerOpen}
        overlayProps={{
          ref: overlayRef,
          className: "fixed inset-0 bg-black bg-opacity-50 z-40",
          style: { height: "100vh", width: "100vw" },
        }}
      >
        <Card color="transparent" shadow={false} className="h-full w-full p-4">
          <div className="mb-2 flex items-center justify-between gap-4 p-4">
            <Link
              to="/dashboard"
              className="flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-800 bg-clip-text text-transparent text-2xl font-semibold transition-all hover:text-indigo-400"
              onClick={closeDrawer}
            >
              <img src={logoImg} alt="logoImg" className="h-5 w-5" />
              InventorCS
            </Link>

            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <IoClose className="text-2xl" />
            </IconButton>
          </div>
          <hr className="my-2 border-blue-gray-50" />

          <List>
            {user?.selectedRole !== 0 && (
              <>
                {/* Menu for role 1 and 2 */}
                <NavLink
                  to="/inventories"
                  onClick={closeDrawer}
                  className={getNavLinkClass}
                >
                  <ListItem className="flex gap-2 items-center text-indigo-800">
                    <MdOutlineInventory2 className="text-md" />
                    Our Inventories
                  </ListItem>
                </NavLink>

                <NavLink
                  to="/borrowed-item"
                  onClick={closeDrawer}
                  className={getNavLinkClass}
                >
                  <ListItem className="flex gap-2 items-center text-indigo-800">
                    <BsCartCheck className="text-md" />
                    Borrowed Item
                  </ListItem>
                </NavLink>

                {user?.selectedRole !== 2 && (
                  <NavLink
                    to="/users"
                    onClick={closeDrawer}
                    className={getNavLinkClass}
                  >
                    <ListItem className="flex gap-2 items-center text-indigo-800">
                      <LuUserCog className="text-md" />
                      Users List
                    </ListItem>
                  </NavLink>
                )}
              </>
            )}

            <NavLink
              to="/profile"
              onClick={closeDrawer}
              className={getNavLinkClass}
            >
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <CgProfile className="text-md" />
                My Profile
              </ListItem>
            </NavLink>

            <NavLink
              to="/settings"
              onClick={closeDrawer}
              className={getNavLinkClass}
            >
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <IoSettingsOutline className=" text-md" />
                Settings
              </ListItem>
            </NavLink>

            <ListItem
              className="flex gap-2 items-center text-red-700 hover:text-red-900"
              onClick={() => handleOpenDialog("xs")}
            >
              <FaPowerOff className="text-md" />
              Sign Out
            </ListItem>
          </List>
        </Card>
      </Drawer>

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

export default SidebarComponent;
