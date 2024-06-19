import React, { useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  IconButton,
  List,
  ListItem,
  Drawer,
  Card,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const SidebarDashboard = ({ isDrawerOpen = false, closeDrawer }) => {
  const overlayRef = useRef(null);

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
            <ListItem>Log Out</ListItem>
          </List>
        </Card>
      </Drawer>
    </>
  );
};

export default SidebarDashboard;
