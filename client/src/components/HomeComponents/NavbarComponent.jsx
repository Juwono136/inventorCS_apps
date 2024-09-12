import React, { useEffect, useState } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  Menu,
  MenuHandler,
  Button,
  Avatar,
  MenuList,
  MenuItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { FaCartShopping } from "react-icons/fa6";
import { FiMenu } from "react-icons/fi";
import { IoCloseOutline } from "react-icons/io5";
import { LuLayoutDashboard } from "react-icons/lu";
import { CiPower } from "react-icons/ci";
import logoImg from "../../assets/images/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { logout, reset } from "../../features/auth/authSlice";
import DialogOpenComponent from "../DashboardComponents/DialogOpenComponent";

const NavbarComponent = () => {
  const [openNav, setOpenNav] = useState(false);
  const [isMenuProfileOpen, setIsMenuProfileOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const { userInfor } = useSelector((state) => state.user);

  const { avatar } = userInfor?.personal_info || "";

  const closeMenuProfile = () => setIsMenuProfileOpen(false);

  const handleOpenDialog = () => {
    setOpenDialog(!openDialog);
  };

  useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 768 && setOpenNav(false)
    );

    if (isLoggedOut) {
      setOpenDialog(false);
    }
  }, [isLoggedOut]);

  const handleNavigation = (section) => {
    navigate(`/#${section}`);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    dispatch(reset());
    navigate("/signin");
  };

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 md:mb-0 md:mt-0 md:flex-row md:items-center md:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <HashLink
          smooth
          to="/#inventories"
          className="flex items-center"
          onClick={() => handleNavigation("inventories")}
        >
          Inventories
        </HashLink>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <HashLink
          smooth
          to="/#team"
          className="flex items-center"
          onClick={() => handleNavigation("team")}
        >
          Our Team
        </HashLink>
      </Typography>
    </ul>
  );

  return (
    <>
      <Navbar className="sticky top-0 h-max max-w-full z-50 rounded-none px-4 py-2 lg:px-8 lg:py-4">
        <div className="flex items-center justify-between text-blue-gray-900">
          <a
            href="/"
            className="flex gap-2 items-center justify-center mx-4 cursor-pointer py-1.5 font-bold text-xl text-indigo-700 hover:text-indigo-900"
          >
            <img src={logoImg} alt="logoImg" className="h-5 w-5" />
            InventorCS
          </a>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">{navList}</div>

            <div className="flex md:flex-row flex-row-reverse items-center justify-center gap-3">
              {user && isLoggedOut === false ? (
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
                      <LuLayoutDashboard className="h-4 w-4" strokeWidth={2} />
                      <a href="/dashboard" className="text-sm">
                        My Dashboard
                      </a>
                    </MenuItem>

                    <MenuItem
                      onClick={handleOpenDialog}
                      className="flex items-center gap-2 rounded hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                    >
                      <CiPower
                        className="h-4 w-4 text-red-500"
                        strokeWidth={2}
                      />
                      <ListItemPrefix className="text-sm text-red-500">
                        Sign Out
                      </ListItemPrefix>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                <div className="flex items-center gap-x-1">
                  <a
                    href="/signin"
                    className="text-sm px-3 hover:text-indigo-700 hover:font-semibold hidden md:inline-block"
                  >
                    <span>Log In</span>
                  </a>
                  <a
                    href="/signup"
                    className="text-sm bg-indigo-700 text-white p-2.5 rounded-md shadow-md hover:bg-indigo-600 hidden md:inline-block"
                  >
                    <span>Sign Up</span>
                  </a>
                </div>
              )}

              <Link to="/mycarts">
                <button className="flex justify-center items-center gap-1">
                  <FaCartShopping className="text-indigo-700 text-xl transition ease-in-out hover:text-indigo-400" />
                  <span className="bg-indigo-700 text-white text-sm rounded-full px-2 py-1">
                    4
                  </span>
                </button>
              </Link>
            </div>
            <IconButton
              variant="text"
              className="ml-auto h-6 w-6 p-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent md:hidden"
              ripple={false}
              onClick={() => setOpenNav(!openNav)}
            >
              {openNav ? (
                <IoCloseOutline className="h-8 w-8 text-indigo-700" />
              ) : (
                <FiMenu className="h-6 w-6 text-indigo-700" />
              )}
            </IconButton>
          </div>
        </div>
        <Collapse open={openNav}>
          {navList}
          {user && isLoggedOut === false ? (
            ""
          ) : (
            <div className="flex items-center gap-x-2">
              <a
                href="/signin"
                className="text-sm w-full text-center text-black bg-gray-100 p-3 rounded-md hover:text-indigo-700 hover:font-semibold"
              >
                <span>Log In</span>
              </a>
              <a
                href="/signup"
                className="text-sm w-full text-center bg-indigo-700 text-white p-2.5 rounded-md shadow-md hover:bg-indigo-600"
              >
                <span>Sign Up</span>
              </a>
            </div>
          )}
        </Collapse>
      </Navbar>
      <Outlet />

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
