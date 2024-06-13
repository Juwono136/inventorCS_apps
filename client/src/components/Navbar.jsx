import React, { useEffect, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import {
  Navbar,
  Collapse,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import CartsDrawer from "../common/CartsDrawer";
import { FaCartShopping } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";

const NavbarComponent = () => {
  const [openNav, setOpenNav] = useState(false);
  const [open, setOpen] = useState(false);

  const openDrawer = () => setOpen(true);
  const closeDrawer = () => setOpen(false);

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false)
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/products" className="flex items-center">
          Inventories
        </Link>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <Link to="/team" className="flex items-center">
          Our Team
        </Link>
      </Typography>
    </ul>
  );

  return (
    <>
      <Navbar className="sticky top-0 h-max max-w-full z-50 rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Link
            to="/"
            className="mr-4 cursor-pointer py-1.5 font-bold text-xl text-indigo-700 hover:text-indigo-900"
          >
            InventorCS
          </Link>
          <div className="flex items-center gap-4">
            <div className="mr-4 hidden lg:block">{navList}</div>
            <div className="flex items-center gap-x-1">
              <Link
                to="/signin"
                className="text-sm px-3 hover:text-indigo-700 hover:font-semibold hidden lg:inline-block"
              >
                <span>Log In</span>
              </Link>

              <Link
                to="/signup"
                className="text-sm bg-indigo-700 text-white p-2.5 rounded-md shadow-md hover:bg-indigo-600 hidden lg:inline-block"
              >
                <span>Sign Up</span>
              </Link>
            </div>

            <button
              onClick={openDrawer}
              className="flex justify-center items-center gap-1"
            >
              <FaCartShopping className="text-indigo-700 text-xl transition ease-in-out hover:text-indigo-400" />
              <span className="bg-indigo-700 text-white text-sm rounded-full px-2 py-1">
                4
              </span>
            </button>

            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 p-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <IoCloseOutline className="h-8 w-8" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
          <div className="flex items-center gap-x-2">
            <Link
              to="/signin"
              className="text-sm w-full text-center text-black bg-gray-100 p-3 rounded-md hover:text-indigo-700 hover:font-semibold"
            >
              <span>Log In</span>
            </Link>
            <Link
              to="/signup"
              className="text-sm w-full text-center bg-indigo-700 text-white p-2.5 rounded-md shadow-md hover:bg-indigo-600"
            >
              <span>Sign Up</span>
            </Link>
          </div>
        </Collapse>
      </Navbar>

      <CartsDrawer open={open} onClose={closeDrawer} />
      <Outlet />
    </>
  );
};

export default NavbarComponent;
