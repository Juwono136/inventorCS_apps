import React from "react";
import { GiCircuitry } from "react-icons/gi";
import { FaRegNewspaper } from "react-icons/fa6";
import { FaLaptop } from "react-icons/fa";
import { SiArduino } from "react-icons/si";
import { MdAddShoppingCart } from "react-icons/md";

const CategorySection = () => {
  return (
    <div className="container px-6 pb-16 mx-auto">
      <div className="text-indigo-600 mb-10 text-center">
        <h1 className="text-2xl">Inventory by category</h1>
      </div>

      <div className="flex gap-6 items-center justify-center flex-wrap">
        <button className="flex items-center justify-center flex-col gap-3 w-[150px] bg-blue-200 text-blue-800 font-semibold p-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white">
          <GiCircuitry className="text-4xl" />
          Electronics
        </button>

        <button className="flex items-center justify-center flex-col gap-3 w-[150px] bg-blue-200 text-blue-800 font-semibold p-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white">
          <FaRegNewspaper className="text-4xl" />
          Papers
        </button>

        <button className="flex items-center justify-center flex-col gap-3 w-[150px] bg-blue-200 text-blue-800 font-semibold p-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white">
          <FaLaptop className="text-4xl" />
          Gadgets
        </button>

        <button className="flex items-center justify-center flex-col gap-3 w-[150px] bg-blue-200 text-blue-800 font-semibold p-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white">
          <SiArduino className="text-4xl" />
          Arduinos
        </button>

        <button className="flex items-center justify-center flex-col gap-3 w-[150px] bg-blue-200 text-blue-800 font-semibold p-4 rounded-lg shadow-md hover:bg-blue-500 hover:text-white">
          <MdAddShoppingCart className="text-4xl" />
          Others
        </button>
      </div>
    </div>
  );
};

export default CategorySection;
