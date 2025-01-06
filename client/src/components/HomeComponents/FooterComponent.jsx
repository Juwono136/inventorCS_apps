import React from "react";

// icons and material-tailwind
import { Typography } from "@material-tailwind/react";
import LogoImg from "../../assets/images/logo.png";

// components
import SocialMenu from "../../common/SocialMenu";

const FooterComponent = () => {
  return (
    <footer className="w-full bg-white p-8">
      <hr className="w-full border-indigo-100 mb-8" />

      <div className="flex flex-col md:flex-row items-center justify-center gap-x-12 mx-4 md:justify-start">
        <p className="text-base font-semibold text-gray-800 my-2">Follow Us</p>
        <SocialMenu />
      </div>

      <hr className="w-full border-indigo-100 my-8" />

      <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-center md:justify-start">
        <a
          href="#"
          className="flex gap-2 items-center justify-center mx-4 cursor-pointer py-1.5 font-bold text-xl text-indigo-700 hover:text-indigo-900"
        >
          <img src={LogoImg} alt="logoImg" className="h-5 w-5" />
          InventorCS
        </a>
        <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
          <li>
            <Typography
              as="a"
              href="/inventory-list"
              className="font-semibold transition-colors text-gray-700 hover:text-gray-900"
            >
              Inventories
            </Typography>
          </li>
          <li>
            <Typography
              as="a"
              href="#team"
              className="font-semibold transition-colors text-gray-700 hover:text-gray-900"
            >
              Our Team
            </Typography>
          </li>
        </ul>
      </div>
      <hr className="my-4 border-blue-gray-50" />
      <Typography color="blue-gray" className="text-center text-xs font-normal">
        Copyright &#169; {new Date().getFullYear()} InventorCS v1.0
      </Typography>
    </footer>
  );
};

export default FooterComponent;
