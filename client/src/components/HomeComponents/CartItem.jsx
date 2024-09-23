import React, {useState} from 'react';
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";
import { useCart } from '../InventoryComponents/CartContext';
import product1 from "../../assets/images/inventory_img.jpg";
import DialogOpenComponent from '../DashboardComponents/DialogOpenComponent';


const CartItems = ({items}) => {
  const { removeFromCart, increaseQuantity, decreaseQuantity } = useCart(); 
  const [openDialog, setOpenDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  const handleOpenDialog = (itemID) => {
    setOpenDialog(!openDialog);
    setItemToRemove(itemID);
  };

  const handleRemove = () => {
    if (itemToRemove) {
      removeFromCart(itemToRemove);
      setOpenDialog(false);
      setItemToRemove(null);
    }
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
            <Card key={item.item_id} className="shadow-lg rounded-lg transform transition-transform hover:scale-105 hover:shadow-xl">
              <CardBody className="bg-gradient-to-r from-gray-100 to-white rounded-lg">
                <div className="flex">
                  <img src={product1} alt={item.item_name} className="w-24 h-24 object-cover rounded-lg mr-4 shadow-sm" />
                  <div className="flex-1">
                    <Typography variant="h6" className="font-semibold">{item.item_name}</Typography>
                    <Typography variant="body2" color="gray">{item.category}</Typography>
                    <Typography variant="body2" className="mt-2">{item.description}</Typography>
                    <div className="flex items-center mt-2 space-x-2">
                      <Button className="rounded-full bg-blue-500 text-white" onClick={() => decreaseQuantity(item.item_id)}>-</Button>
                      <Typography variant="body2" className="mx-2">{item.quantity}</Typography>
                      <Button className="rounded-full bg-blue-500 text-white" onClick={() => increaseQuantity(item.item_id)}>+</Button>
                    </div>
                  </div>
                  <Button color="red" className="ml-4" onClick={() => handleOpenDialog(item.item_id)}>Remove</Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <DialogOpenComponent
        openDialog={openDialog}
        handleFunc={handleRemove}
        handleOpenDialog={handleOpenDialog}
        message="Are you sure you want to remove this item from your cart?"
        btnText="Confirm"
      />
    </div>
    
  );
};

export default CartItems;
