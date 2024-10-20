import React, { useState } from "react";
import InventoryCardModal from "./InventoryCardModal";

const InventoryCard = ({
  image,
  title,
  total_items,
  status,
  serial_number,
  desc,
  categories,
  addToCart,
}) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const itemDetails = {
    image,
    title,
    total_items,
    status,
    serial_number,
    desc,
    categories,
  };

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="h-64 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
      </div>
      <div className="p-4 flex flex-col justify-center gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-sm bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {title}
          </h2>
          <p className="text-xs font-semibold text-purple-900 my-1">
            Total Items:{" "}
            <span className="text-purple-00 bg-purple-100 px-1.5 py-1 rounded-md">
              {total_items}
            </span>
          </p>
          <p
            className={`text-base font-bold ${
              status === "Available" ? "text-green-800" : "text-red-800"
            } `}
          >
            {status}
          </p>

          <div className="flex flex-wrap gap-1.5 w-full mt-4">
            {categories?.map((category, i) => (
              <div
                key={i}
                className="inline-block px-2 py-1.5 bg-red-400 rounded-lg hover:bg-red-200"
              >
                <p className="text-xs text-white font-base">{category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 flew-wrap">
          <button
            className={`text-xs px-4 py-2 rounded-md transition ${
              total_items === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 text-white hover:bg-indigo-700"
            }`}
            disabled={total_items === 0}
            onClick={addToCart}
          >
            Add to Cart
          </button>

          <button
            className="text-xs px-4 py-2 rounded-md transition bg-purple-900 text-white hover:bg-purple-700"
            onClick={handleOpen}
          >
            See Details
          </button>
        </div>
      </div>

      <InventoryCardModal
        open={open}
        handleOpen={handleOpen}
        item={itemDetails}
      />
    </div>
  );
};

export default InventoryCard;