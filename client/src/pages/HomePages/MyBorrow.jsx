import React, { useState } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import TimeLineModal from '../../components/HomeComponents/TimeLineModal';
import NavbarComponent from '../../components/DashboardComponents/NavbarComponent'; // Import the NavbarComponent

const MyBorrow = () => {
  const navigate = useNavigate();
  const [borrowedItems, setBorrowedItems] = useState([
    { id: 1, name: 'Book', description: 'A thrilling mystery novel', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794', status: 'Borrowed' },
    { id: 2, name: 'Laptop', description: 'High-performance laptop', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', status: 'Returned' },
    { id: 3, name: 'Chair', description: 'Comfortable office chair', imageUrl: 'https://images.unsplash.com/photo-1562183240-33d6d9d9d0e6', status: 'Borrowed' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <NavbarComponent /> {/* Include the NavbarComponent */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center mb-6">
          <Typography variant="h4" className="font-bold text-lg sm:text-xl lg:text-2xl">My Borrowed Items</Typography>
        </div>
        {borrowedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Typography variant="h6" className="mb-4 text-base sm:text-lg lg:text-xl">You have no borrowed items</Typography>
            <Button color="blue" className="text-sm sm:text-base lg:text-lg" onClick={() => navigate('/inventories')}>Go Back to Inventories</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {borrowedItems.map(item => (
              <div key={item.id} className="border p-4 rounded-lg flex flex-col items-center">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mb-4" />
                <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                <p className="text-sm mb-2">{item.description}</p>
                <Typography variant="body2" className={`text-sm mb-2 ${item.status === 'Returned' ? 'text-green-500' : item.status === 'Pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                  Status: {item.status === 'Borrowed' ? 'Pending' : item.status}
                </Typography>
                <Button color="blue" className="text-sm sm:text-base lg:text-lg" onClick={() => handleOpenModal(item)}>View Status</Button>
              </div>
            ))}
          </div>
        )}
        {isModalOpen && <TimeLineModal item={selectedItem} onClose={handleCloseModal} />}
      </div>
    </div>
  );
};

export default MyBorrow;