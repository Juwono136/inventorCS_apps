import React, { useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  Drawer,
  Card,
  Dialog,
  DialogHeader,
  Typography,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
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
              className="text-indigo-700 text-2xl font-semibold transition-all hover:text-indigo-400"
              onClick={closeDrawer}
            >
              InventorCS
            </Link>

            <IconButton variant="text" color="blue-gray" onClick={closeDrawer}>
              <IoClose className="text-2xl" />
            </IconButton>
          </div>
          <List onClick={closeDrawer}>
            <ListItem>
              <NavLink to="/inventories">Inventories</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/borrowed-item">Borrowed Item</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/users">Update User</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/profile">Profile</NavLink>
            </ListItem>
            <ListItem>
              <NavLink to="/settings">Settings</NavLink>
            </ListItem>
            <ListItem onClick={handleOpenDialog}>Log Out</ListItem>
          </List>
        </Card>
      </Drawer>

      {/* Dialog logout button */}
      <Dialog open={openDialog} handler={handleOpenDialog}>
        <DialogHeader>
          <Typography variant="h5" className="text-indigo-900">
            Attention is Required!
          </Typography>
        </DialogHeader>

        <DialogBody divider className="grid place-items-center gap-4">
          <i className="bx bxs-bell text-4xl text-indigo-900"></i>
          <Typography className="text-indigo-700 text-xl">
            You want to logout?
          </Typography>
        </DialogBody>

        <DialogFooter className="space-x-2">
          <Button variant="text" color="blue-gray" onClick={handleOpenDialog}>
            Back
          </Button>
          <Button className="bg-indigo-700" onClick={handleLogout}>
            Logout
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SidebarDashboard;
