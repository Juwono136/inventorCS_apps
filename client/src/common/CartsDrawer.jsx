import React, { useState } from "react";
import {
  Drawer,
  Typography,
  IconButton,
  Button,
} from "@material-tailwind/react";
import { IoCloseOutline } from "react-icons/io5";
import { FaPlus, FaMinus } from "react-icons/fa6";

const CartsDrawer = ({ open, onClose }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value >= 0) {
      setQuantity(parseInt(value));
    }
  };

  return (
    <Drawer
      open={open}
      overlay={false}
      placement="right"
      className="p-4 bg-gray-200"
    >
      <div className="mb-6 flex items-center justify-between">
        <Typography variant="h5" color="blue-gray" className="w-full px-2">
          My Cart
        </Typography>
        <IconButton variant="text" color="blue-gray" onClick={onClose}>
          <IoCloseOutline className="w-6 h-6" />
        </IconButton>
      </div>
      <div className="flex flex-col justify-between h-full">
        <div className="py-4">
          <div className="flex justify-between items-center py-2">
            <p className="text-sm font-semibold">Product 01</p>
            <div className="flex items-center">
              <button
                onClick={handleDecrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleChange}
                className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                min="1"
                step="1"
              />
              <button
                onClick={handleIncrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-2">
            <p className="text-sm font-semibold">Product 01</p>
            <div className="flex items-center">
              <button
                onClick={handleDecrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleChange}
                className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                min="1"
                step="1"
              />
              <button
                onClick={handleIncrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-2">
            <p className="text-sm font-semibold">Product 01</p>
            <div className="flex items-center">
              <button
                onClick={handleDecrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleChange}
                className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                min="1"
                step="1"
              />
              <button
                onClick={handleIncrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaPlus />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center py-2">
            <p className="text-sm font-semibold">Product 01</p>
            <div className="flex items-center">
              <button
                onClick={handleDecrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaMinus />
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleChange}
                className="mx-2 w-12 text-center border border-gray-300 rounded-md"
                min="1"
                step="1"
              />
              <button
                onClick={handleIncrease}
                className="bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-full p-2"
              >
                <FaPlus />
              </button>
            </div>
          </div>
        </div>
        <div className="pb-8">
          <div className="flex justify-between items-center gap-1 px-2">
            <h1 className="text-md font-semibold">Sub Total:</h1>
            <span className="text-md font-semibold">0</span>
          </div>
          <Button
            size="sm"
            className="bg-indigo-700 my-10 w-full transition ease-in-out hover:bg-indigo-800"
          >
            Check out
          </Button>
        </div>
      </div>
    </Drawer>
  );
};

export default CartsDrawer;
