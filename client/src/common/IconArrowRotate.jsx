import React from "react";

// icons and material-tailwind
import { IoIosArrowDown } from "react-icons/io";

const IconArrowRotate = ({ id, open }) => {
  return (
    <IoIosArrowDown
      className={`${
        id === open ? "rotate-180" : ""
      } text-base transition-transform`}
    />
  );
};

export default IconArrowRotate;
