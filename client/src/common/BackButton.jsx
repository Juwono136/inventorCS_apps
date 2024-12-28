import React from "react";
import { Button } from "@material-tailwind/react";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ link }) => {
  return (
    <>
      <a href={link}>
        <Button className="flex items-center mb-4 capitalize bg-indigo-500 text-xs py-2 px-3">
          <FaArrowLeft className="mr-1" />
          Back
        </Button>
      </a>
    </>
  );
};

export default BackButton;
