import React from 'react';
import { Typography } from "@material-tailwind/react";

const ItemInfoModal = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 sm:w-3/4 lg:w-1/2 relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          &times;
        </button>
        <Typography variant="h5" className="font-bold mb-4">Item Information</Typography>
        <div className="mb-4">
          <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mb-4 rounded-full shadow-md mx-auto" />
          <Typography variant="h6" className="font-bold text-center">{item.name}</Typography>
          <Typography variant="body2" className="text-center">{item.description}</Typography>
        </div>
      </div>
    </div>
  );
};

export default ItemInfoModal;