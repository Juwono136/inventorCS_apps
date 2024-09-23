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

const InventoryCard = ({ image, item, addToCart }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105">
      <div className="h-64 overflow-hidden relative">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-base bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {item.item_name}
          </h2>
          <p className="text-sm font-semibold text-green-800">{item.status}</p>
        </div>
        <button className="bg-indigo-500 text-white text-xs px-4 py-2 rounded-md hover:bg-indigo-700 transition" onClick={addToCart}>
          Add to Cart
        </button>
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
