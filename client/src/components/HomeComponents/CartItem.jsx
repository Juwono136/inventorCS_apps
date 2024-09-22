import React from 'react';
import { Button, Typography, Card, CardBody } from "@material-tailwind/react";

const CartItem = ({ item, onIncreaseQuantity, onDecreaseQuantity, onRemove }) => {
  return (
    <Card className="shadow-lg rounded-lg transform transition-transform hover:scale-105 hover:shadow-xl">
      <CardBody className="bg-gradient-to-r from-gray-100 to-white rounded-lg">
        <div className="flex">
          <img src={item.imageUrl} alt={item.name} className="w-24 h-24 object-cover rounded-lg mr-4 shadow-sm" />
          <div className="flex-1">
            <Typography variant="h6" className="font-semibold">{item.name}</Typography>
            <Typography variant="body2" color="gray">{item.category}</Typography>
            <Typography variant="body2" className="mt-2">{item.description}</Typography>
            <div className="flex items-center mt-2 space-x-2">
              <Button className="rounded-full bg-blue-500 text-white" onClick={() => onDecreaseQuantity(item.id)}>-</Button>
              <Typography variant="body2" className="mx-2">{item.quantity}</Typography>
              <Button className="rounded-full bg-blue-500 text-white" onClick={() => onIncreaseQuantity(item.id)}>+</Button>
            </div>
          </div>
          {item.quantity === 0 && (
            <Button color="red" className="ml-4" onClick={() => onRemove(item)}>Remove</Button>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default CartItem;