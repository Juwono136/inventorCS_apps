import React from "react";
import { Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Button
      onClick={handleBack}
      className="flex items-center my-3 capitalize bg-indigo-500"
      size="sm"
    >
      <FaArrowLeft className="mr-1" />
      Back
    </Button>
  );
};

export default BackButton;
