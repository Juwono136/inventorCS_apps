import React from "react";



const InventoryCard = ({ image, item, addToCart }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden transition-transform transform hover:scale-105 cursor-pointer">
      <div className="h-64 overflow-hidden relative">
        <img src={image} className="w-full h-full object-cover" alt={item.item_name} />
        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
      </div>
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-base bg-gradient-to-r from-blue-400 via-purple-500 to-red-500 bg-clip-text text-transparent animate-gradient">
            {item.item_name}
          </h2>
          <p className="text-sm font-semibold text-green-800">{item.status}</p>
        </div>
        <button
          onClick={addToCart} 
          className="bg-indigo-500 text-white text-xs px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default InventoryCard;