import React from "react";
import {
  FaGithub,
  FaInstagram,
  FaGlobeAmericas,
  FaYoutube,
} from "react-icons/fa";

const IconButton = ({ icon, linkIcon }) => {
  return (
    <div className="p-1.5">
      <div className="flex items-center justify-center p-2.5 rounded-full bg-white shadow-lg transition-transform duration-300 hover:scale-110 cursor-pointer text-xl text-indigo-800">
        <a href={linkIcon} target="_blank">
          {icon}
        </a>
      </div>
    </div>
  );
};

const SocialMenu = () => {
  return (
    <div className="flex justify-center md:max-w-min rounded-md">
      <IconButton
        icon={<FaGithub />}
        linkIcon="https://github.com/focm-binus"
      />
      <IconButton
        icon={<FaYoutube />}
        linkIcon="https://www.youtube.com/@csbinusinternational1299"
      />
      <IconButton
        icon={<FaInstagram />}
        linkIcon="https://www.instagram.com/cs_binus_univ_intl/"
      />
      <IconButton
        icon={<FaGlobeAmericas />}
        linkIcon="https://international.binus.ac.id/computer-science/"
      />
    </div>
  );
};

export default SocialMenu;
