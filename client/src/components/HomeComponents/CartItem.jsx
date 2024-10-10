import React, { useState } from 'react';
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { useCart } from '../InventoryComponents/CartContext';
import DialogOpenComponent from '../DashboardComponents/DialogOpenComponent';
import { FaTrashAlt } from "react-icons/fa";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";

const CartItems = ({ items }) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart();
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [tempItem, setTempItem] = useState(null);

  const handleOpenDialog = (item) => {
    setOpenDialog(true);
    setItemToRemove(item.asset_id);
    setTempItem(item);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (tempItem && tempItem.quantity - 1 === 0) {
      increaseQuantity(tempItem.asset_id);
    }
    setItemToRemove(null);
    setTempItem(null);
  };

  const handleRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setOpenDialog(false);
      setItemToRemove(null);
      setTempItem(null);
    }
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity - 1 === 0) {
      handleOpenDialog(item);
    }
    decreaseQuantity(item.asset_id);
  };

  return (
    <div className="container mx-auto p-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Typography variant="h6" className="mb-4">Your cart is empty</Typography>
          <Button color="blue" onClick={() => window.location.href = '/inventories'}>Go Back to Inventories</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {items.map(item => (
            <Card 
              key={item.asset_id} 
              className="shadow-lg rounded-lg transform transition-all hover:scale-105 hover:shadow-2xl">
              <CardBody className="bg-gradient-to-r from-white via-gray-50 to-gray-200 rounded-lg p-6">
                <div className="flex">
                  <img 
                    src={item.asset_img} 
                    alt={item.asset_name} 
                    className="w-24 h-24 object-cover rounded-lg mr-4 shadow-md hover:shadow-lg transition-shadow" 
                  />
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <Typography variant="h6" className="font-semibold text-gray-700">{item.asset_name}</Typography>
                      <Typography variant="h6" className="font-semibold text-orange-700"> Stock:{item.total_items}</Typography>
                    </div>
                    <Typography variant="body2" className="mt-2 text-gray-500">{item.desc}</Typography>
                    <div className="flex items-center mt-4 space-x-2">
                      <div className="flex items-center justify-between border-2 border-gray-500 rounded-lg px-2 py-2 gap-4">
                        <button 
                          class="flex-shrink-0 inline-flex items-center justify-center h-4 w-4 focus:ring-gray-100"
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          <HiOutlineMinus color="black" />
                        </button>
                        <Typography 
                          variant="body2" 
                          class="w-8 flex-shrink-0 text-gray-900 dark:text-white bg-transparent text-sm font-normal focus:outline-none focus:ring-0 text-center"
                        >
                          {item.quantity}
                        </Typography>
                        <button 
                          class="flex-shrink-0 inline-flex items-center justify-center h-4 w-4 focus:ring-gray-100"
                          onClick={() => increaseQuantity(item.asset_id)}  
                          disabled={item.quantity >= item.total_items}
                        >
                          <HiOutlinePlus color={item.quantity >= item.total_items ? "gray" : "black"} />
                        </button>
                      </div>
                      <button 
                        onClick={() => handleOpenDialog(item)}  
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={handleRemove}
        handleOpenDialog={handleCloseDialog}
        message="Are you sure you want to remove this item from your cart?"
        btnText="Confirm"
      />
    </div>
  );
};

export default CartItems;
