import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Navbar,
  IconButton,
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
} from "@material-tailwind/react";
import { HiMenuAlt2 } from "react-icons/hi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { CiPower } from "react-icons/ci";
import { FaArrowRight } from "react-icons/fa";

import SidebarDashboard from "./SidebarDashboard";

const profileMenuItems = [
  {
    label: "My Profile",
    icon: IoPersonCircleOutline,
    url: "/profile",
  },
  {
    label: "Sign Out",
    icon: CiPower,
    url: "/signout",
  },
];

const NavbarDashboard = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMenuProfileOpen, setIsMenuProfileOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const closeMenuProfile = () => setIsMenuProfileOpen(false);

  return (
    <div className="flex">
      <Navbar
        color="blue-gray"
        className="sticky top-0 z-10 h-max max-w-full bg-indigo-700 px-4 py-3 rounded-none"
      >
        <div className="flex flex-wrap items-center justify-between gap-y-4 text-white">
          <div className="flex items-center justify-center gap-2">
            <IconButton variant="text" size="lg" onClick={openDrawer}>
              <HiMenuAlt2 className="h-8 w-8 text-white" />
            </IconButton>
            <Link
              to="/dashboard"
              className="text-sm md:text-lg font-semibold mr-4 ml-2 cursor-pointer py-1.5 transition-all hover:text-gray-300"
            >
              InventorCS Dashboard
            </Link>
          </div>

          <div className="flex items-center gap-2 mx-3">
            <div className="px-6 hidden md:flex">
              <Link
                to="/"
                target={"_blank"}
                className="flex items-center justify-center gap-2 bg-white text-indigo-500 text-sm font-semibold px-2 py-1 rounded-md transition-all hover:bg-indigo-100"
              >
                See Home Page
                <FaArrowRight className="text-md" />
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
                    src="https://docs.material-tailwind.com/img/face-2.jpg"
                  />
                </Button>
              </MenuHandler>
              <MenuList className="p-1">
                {profileMenuItems.map(({ label, icon, url }, key) => {
                  const isLastItem = key === profileMenuItems.length - 1;
                  return (
                    <MenuItem
                      key={label}
                      onClick={closeMenuProfile}
                      className={`flex items-center gap-2 rounded ${
                        isLastItem
                          ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                          : ""
                      }`}
                    >
                      {React.createElement(icon, {
                        className: `h-4 w-4 ${
                          isLastItem ? "text-red-500" : ""
                        }`,
                        strokeWidth: 2,
                      })}
                      <Link
                        to={url}
                        className="text-sm"
                        color={isLastItem ? "red" : "inherit"}
                      >
                        {label}
                      </Link>
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </div>
        </div>
      </Navbar>
      <SidebarDashboard isDrawerOpen={isDrawerOpen} closeDrawer={closeDrawer} />
    </div>
  );
};

export default NavbarDashboard;
