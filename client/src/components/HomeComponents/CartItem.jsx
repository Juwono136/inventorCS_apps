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
    <div className="container mx-auto p-4 relative">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Typography variant="h6" className="mb-4">Your cart is empty</Typography>
          <Button color="blue" onClick={() => window.location.href = '/inventories'}>Go Back to Inventories</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map(item => (
            <Card key={item.asset_id} className="shadow-lg rounded-lg transform transition-transform hover:scale-105 hover:shadow-xl">
              <CardBody className="bg-gradient-to-r from-gray-100 to-white rounded-lg">
                <div className="flex">
                  <img src={item.asset_img} alt={item.asset_name} className="w-24 h-24 object-cover rounded-lg mr-4 shadow-sm" />
                  <div className="flex-1">
                    <Typography variant="h6" className="font-semibold">{item.asset_name}</Typography>
                    <Typography variant="body2" className="mt-2">{item.desc}</Typography>
                    <div className="flex items-center mt-2 space-x-2">
                      <Button className="rounded-full bg-blue-500 text-white" onClick={() => handleDecreaseQuantity(item)}>-</Button>
                      <Typography variant="body2" className="mx-2">{item.quantity}</Typography>
                      <Button className="rounded-full bg-blue-500 text-white" onClick={() => increaseQuantity(item.asset_id)}>+</Button>
                    </div>
                  </div>
                  <Button color="red" className="ml-4" onClick={() => handleOpenDialog(item)}>Remove</Button>
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
