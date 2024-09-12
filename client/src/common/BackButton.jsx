import React from "react";
import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = ({ link }) => {
  return (
    <>
      <a href={link}>
        <Button
          className="flex items-center my-3 capitalize bg-indigo-500"
          size="sm"
        >
          <FaArrowLeft className="mr-1" />
          Back
        </Button>
      </a>
    </>
  );
};

export default BackButton;
