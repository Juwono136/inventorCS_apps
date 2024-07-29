import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  IconButton,
  List,
  ListItem,
  Drawer,
  Card,
  Dialog,
} from "@material-tailwind/react";
import { IoClose, IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";
import { MdOutlineInventory2, MdOutlineInventory } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { LuUserCog } from "react-icons/lu";
import { CgProfile } from "react-icons/cg";

import { logout, reset } from "../features/auth/authSlice";

const SidebarDashboard = ({ isDrawerOpen = false, closeDrawer }) => {
  const overlayRef = useRef(null);
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate("/signin");
    dispatch(reset());
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
              className="flex justify-center items-center gap-2 text-indigo-700 text-2xl font-semibold transition-all hover:text-indigo-400"
              onClick={closeDrawer}
            >
              <MdOutlineInventory className="text-md" />
              InventorCS
            </Link>

            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <IoClose className="text-2xl" />
            </IconButton>
          </div>
          <hr className="my-2 border-blue-gray-50" />

          <List>
            <NavLink to="/inventories" onClick={closeDrawer}>
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <MdOutlineInventory2 className="text-md" />
                Inventories
              </ListItem>
            </NavLink>

            <NavLink to="/borrowed-item" onClick={closeDrawer}>
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <BsCartCheck className="text-md" />
                Borrowed Item
              </ListItem>
            </NavLink>

            <NavLink to="/users" onClick={closeDrawer}>
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <LuUserCog className="text-md" />
                Update User
              </ListItem>
            </NavLink>

            <NavLink to="/profile" onClick={closeDrawer}>
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <CgProfile className="text-md" />
                Profile
              </ListItem>
            </NavLink>

            <NavLink to="/settings" onClick={closeDrawer}>
              <ListItem className="flex gap-2 items-center text-indigo-800">
                <IoSettingsOutline className=" text-md" />
                Settings
              </ListItem>
            </NavLink>

            <ListItem
              className="flex gap-2 items-center text-indigo-800"
              onClick={() => handleOpenDialog("xs")}
            >
              <IoLogOutOutline className="text-md" />
              Log Out
            </ListItem>
          </List>
        </Card>
      </Drawer>

      {/* Dialog logout button */}
      <Dialog open={openDialog} size="xs">
        <div className="flex justify-center items-center flex-col rounded-lg bg-white p-6 shadow-2xl">
          <h2 className="flex items-center justify-center text-md font-bold">
            Are you sure you want to log out?
          </h2>

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              className="rounded bg-red-50 px-4 py-2 text-sm font-medium text-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>

            <button
              className="rounded bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600"
              onClick={handleOpenDialog}
            >
              Back
            </button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SidebarDashboard;
