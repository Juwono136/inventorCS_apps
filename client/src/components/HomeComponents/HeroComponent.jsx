import React from "react";
import { Link } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { IoIosArrowDown } from "react-icons/io";
import HeroImg from "../../assets/images/heroImg.png";
import SocialMenu from "../../common/SocialMenu";
import { useSelector } from "react-redux";

const HeroComponent = () => {
  const { user, isLoggedOut } = useSelector((state) => state.auth);
  const { userInfor } = useSelector((state) => state.user);

  return (
    <section className="relative md:h-[420px] m-6 md:m-10">
      <div className="flex flex-col md:flex-row items-center w-full gap-4 p-10 border bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg h-full">
        <div className="flex-1 flex justify-center md:order-2">
          <img
            src={HeroImg}
            className="w-full h-full object-cover md:w-auto"
            alt="Hero"
          />
        </div>

        <div className="flex-1 text-center md:text-left md:order-1">
          <Typography
            variant="small"
            className="font-bold mb-2 text-indigo-700"
          >
            Binus University International
          </Typography>
          <Typography variant="h4" className="text-indigo-900">
            Computer Science and Creative Art Inventory Center
          </Typography>

          {user && isLoggedOut === false ? (
            <Typography className="mt-2 mb-6 !text-base font-semibold text-indigo-900">
              Welcome,{" "}
              {userInfor?.personal_info?.name.replace(/\b\w/g, (char) =>
                char.toUpperCase()
              )}{" "}
              🖖
            </Typography>
          ) : (
            <>
              <Typography className="mt-2 mb-6 !text-base font-normal text-gray-200">
                Please register your account to borrow our inventory.
              </Typography>

              <Link to="/signup">
                <Button className="flex-shrink-0 bg-indigo-600 rounded-full">
                  Register now
                </Button>
              </Link>
            </>
          )}

          <div className="my-6">
            <p className="text-sm font-semibold text-gray-800 mb-1">
              Follow Us 👇
            </p>
            <SocialMenu />
          </div>
        </div>
      </div>

      {/* Add this part for the arrow icon and scrolling */}
      <a
        href="#inventories"
        className="absolute bottom-0 md:bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
      >
        <IoIosArrowDown size={30} color="#fff" className="animate-bounce" />
      </a>

      {/* Add this section below the HeroComponent */}
      {/* <div
        id="content-below"
        className="h-screen bg-gray-100 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold text-center mt-10">Content Below</h2>
        <p className="text-center mt-4">More content goes here.</p>
      </div> */}
    </section>
  );
};

export default HeroComponent;
