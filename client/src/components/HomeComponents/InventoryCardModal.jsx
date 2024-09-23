import React from "react";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";

const InventoryCardModal = ({ open, handleOpen, item }) => {
  if (!item) return null;
  return (
    <Dialog open={open} handler={handleOpen} size="lg">
      <DialogHeader className="justify-end">
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleOpen}
        >
          <IoClose className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody>
        <div className="flex flex-col justify-center items-center w-full mb-6">
          <Typography className="font-bold text-xl bg-gradient-to-r from-green-800 via-purple-800 to-indigo-600 bg-clip-text text-transparent animate-gradient">
            ITEM INFORMATION
          </Typography>
        </div>

        <div className="flex flex-col items-center">
          <img
            src={item.image}
            alt={item.title}
            className="w-64 h-64 object-cover rounded-lg"
          />

          <div className="flex justify-center items-center flex-wrap gap-1.5 w-full mt-4">
            {item?.categories?.map((category, i) => (
              <div
                key={i}
                className="inline-block px-2 py-1.5 bg-red-400 rounded-lg hover:bg-red-200"
              >
                <p className="text-xs text-white font-base">{category}</p>
              </div>
            ))}
          </div>

          <h2 className="font-semibold text-base text-center md:text-xl my-4 bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {item.title}
          </h2>
          <p className="text-sm text-gray-600 text-center">{item.desc}</p>
          <p className="mt-2 text-purple-700">
            <strong>Total Items:</strong> {item.total_items}
          </p>
          <p
            className={`text-base font-bold mt-2 ${
              item.total_items > 0 ? "text-green-800" : "text-red-800"
            } `}
          >
            {item.status}
          </p>
        </div>
      </DialogBody>
      <DialogFooter>
        <div className="flex justify-between items-center w-full">
          <p className="text-xs">
            Serial Number: <span>{item.serial_number}</span>
          </p>

          <button
            className={`text-xs px-4 py-2 rounded-md transition ${
              item.total_items === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-700"
            }`}
            disabled={item.total_items === 0}
          >
            Add to Cart
          </button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};

export default InventoryCardModal;
