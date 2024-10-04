import React, { useState } from 'react';
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { useCart } from '../InventoryComponents/CartContext';
import DialogOpenComponent from '../DashboardComponents/DialogOpenComponent';

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
                    <Typography variant="h6" className="font-semibold text-gray-700">{item.asset_name}</Typography>
                    <Typography variant="body2" className="mt-2 text-gray-500">{item.desc}</Typography>
                    <div className="flex items-center mt-4 space-x-2">
                      <div className="flex items-center justify-between border-2 border-gray-500 rounded-lg px-2 py-2 space-x-2">
                        <button 
                          class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h16"/>
                          </svg>
                        </button>
                        <Typography 
                          variant="body2" 
                          class="w-8 flex-shrink-0 text-gray-900 dark:text-white bg-transparent text-sm font-normal focus:outline-none focus:ring-0 text-center"
                        >
                          {item.quantity}
                        </Typography>
                        <button 
                          class="flex-shrink-0 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 inline-flex items-center justify-center border border-gray-300 rounded-md h-5 w-5 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none"
                          onClick={() => increaseQuantity(item.asset_id)}  
                        >
                          <svg class="w-2.5 h-2.5 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                          </svg>
                        </button>
                      </div>
                      <button 
                        class="rounded-md bg-slate-800 p-2.5 border border-transparent text-center text-sm text-black transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        onClick={() => handleOpenDialog(item)}  
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                          <path d="M 10 2 L 9 3 L 4 3 L 4 5 L 5 5 L 5 20 C 5 20.522222 5.1913289 21.05461 5.5683594 21.431641 C 5.9453899 21.808671 6.4777778 22 7 22 L 17 22 C 17.522222 22 18.05461 21.808671 18.431641 21.431641 C 18.808671 21.05461 19 20.522222 19 20 L 19 5 L 20 5 L 20 3 L 15 3 L 14 2 L 10 2 z M 7 5 L 17 5 L 17 20 L 7 20 L 7 5 z M 9 7 L 9 18 L 11 18 L 11 7 L 9 7 z M 13 7 L 13 18 L 15 18 L 15 7 L 13 7 z"></path>
                        </svg>
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
