import React, { useState } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import TimelineModal from './TimelineModal';

const ItemInfo = ({ name, description, imageUrl, status }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="border p-4 rounded-lg flex flex-col items-center">
      <img src={imageUrl} alt={name} className="w-24 h-24 mb-4" />
      <h3 className="font-bold text-lg mb-2">{name}</h3>
      <p className="text-sm mb-2">{description}</p>
      <Typography variant="body2" className={`text-sm mb-2 ${status === 'Returned' ? 'text-green-500' : 'text-red-500'}`}>
        Status: {status}
      </Typography>
      <Button color="blue" className="text-sm sm:text-base lg:text-lg" onClick={handleOpenModal}>View Status</Button>
      {isModalOpen && <TimelineModal onClose={handleCloseModal} />}
    </div>
  );
};

export default ItemInfo;