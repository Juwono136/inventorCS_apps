import React, { useState } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import TimeLineModal from '../../components/HomeComponents/TimeLineModal';
import NavbarComponent from '../../components/DashboardComponents/NavbarComponent'; // Import the NavbarComponent

const MyBorrow = () => {
  const navigate = useNavigate();
  const [borrowedItems, setBorrowedItems] = useState([
    { id: 1, name: 'Book', description: 'A thrilling mystery novel', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794', status: 'Pending' },
    { id: 2, name: 'Laptop', description: 'High-performance laptop', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', status: 'Borrowed' },
    { id: 3, name: 'Chair', description: 'Comfortable office chair', imageUrl: 'https://images.unsplash.com/photo-1562183240-33d6d9d9d0e6', status: 'Cancelled' },
    { id: 4, name: 'Tablet', description: 'Latest model tablet', imageUrl: 'https://images.unsplash.com/photo-1581291519195-ef11498d1cf5', status: 'Rejected' },
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

  const handleCancel = (id) => {
    const currentDate = new Date().toLocaleDateString('en-CA'); // Get current date in YYYY-MM-DD format
    setBorrowedItems(borrowedItems.map(item => 
      item.id === id ? { ...item, status: 'Cancelled', cancelDate: currentDate } : item
    ));
  };

  const handleInfo = (item) => {
    // Define the functionality for the Info button here
    console.log('Info button clicked for item:', item);
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
              <div key={item.id} className="border p-4 rounded-lg flex flex-col items-center shadow-lg">
                <img src={item.imageUrl} alt={item.name} className="w-24 h-24 mb-4 rounded-full shadow-md" />
                <h3 className="font-bold text-lg mb-2 text-center">{item.name}</h3>
                <p className="text-sm mb-2 text-center">{item.description}</p>
                <Typography variant="body2" className={`text-sm mb-2 ${item.status === 'Borrowed' ? 'text-green-500' : item.status === 'Pending' ? 'text-yellow-500' : item.status === 'Cancelled' ? 'text-gray-500' : 'text-red-500'}`}>
                  Status: {item.status}
                </Typography>
                {item.status === 'Cancelled' && item.cancelDate && (
                  <Typography variant="body2" className="text-sm mb-2 text-gray-500">
                    Cancelled on: {item.cancelDate}
                  </Typography>
                )}
                <div className="flex space-x-2 mt-4">
                  <Button color="blue" className="text-xs sm:text-sm lg:text-base px-3 py-1 rounded-full shadow-md" onClick={() => handleOpenModal(item)}>Status</Button>
                  <Button color="gray" className="text-xs sm:text-sm lg:text-base px-3 py-1 rounded-full shadow-md" onClick={() => handleInfo(item)}>Info</Button>
                  {item.status !== 'Cancelled' && item.status !== 'Rejected' && (
                    <Button color="red" className="text-xs sm:text-sm lg:text-base px-3 py-1 rounded-full shadow-md" onClick={() => handleCancel(item.id)}>Cancel</Button>
                  )}
                </div>
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