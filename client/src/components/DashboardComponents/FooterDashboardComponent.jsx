import React from "react";

// icons and material-tailwind
import LogoImg from "../../assets/images/logo.png";
import { Typography } from "@material-tailwind/react";
import SocialMenu from "../../common/SocialMenu";

const FooterDashboardComponent = () => {
  return (
    <footer className="w-full bg-white p-12">
      <hr className="w-full border-indigo-100" />

      <div className="flex gap-1 w-full mb-8 flex-col items-center justify-center bg-white text-center">
        <a
          href="/dashboard"
          className="flex gap-2 items-center justify-center cursor-pointer pt-8 font-bold text-xl text-indigo-700 hover:text-indigo-900"
        >
          <img src={LogoImg} alt="logoImg" className="h-5 w-5" />
          InventorCS
        </a>
        <SocialMenu />
      </div>
      <Typography color="blue-gray" className="text-center text-xs font-normal">
        Copyright &#169; {new Date().getFullYear()} InventorCS v1.0
      </Typography>
    </footer>
  );
};

export default FooterDashboardComponent;
