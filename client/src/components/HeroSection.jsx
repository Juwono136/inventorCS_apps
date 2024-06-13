import React from "react";
import { Link } from "react-router-dom";
import HeroImg from "../assets/imgs/heroImg.jpg";

const HeroSection = () => {
  return (
    <div className="container px-6 py-10 mx-auto text-center">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 lg:text-4xl">
          Computer Science Program Inventory Center
        </h1>
        <p className="m-6 text-gray-500">
          Please register first to borrow our inventories
        </p>
        <Link
          to="/signup"
          className="px-5 py-2 text-sm font-medium leading-5 text-center text-white capitalize bg-indigo-600 rounded-lg hover:bg-indigo-500 lg:mx-0 lg:w-auto focus:outline-none"
        >
          Register Here
        </Link>
      </div>

      <div className="flex justify-center mt-10">
        <img
          className="w-full object-cover h-96 rounded-xl lg:w-4/5"
          src={HeroImg}
        />
      </div>
    </div>
  );
};

export default HeroSection;
