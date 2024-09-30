import React, { useState } from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import ConfirmRemovalButtonComponent from '../../components/HomeComponents/ConfirmRemovalButtonComponent';
import CartLogo from '../../assets/images/cartlogo.png';
import BackButton from '../../common/BackButton';

const CartItem = ({ item, onIncreaseQuantity, onDecreaseQuantity, onRemove }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center">
        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover" />
        <div className="ml-4">
          <h4 className="font-bold">{item.name}</h4>
          <p className="text-sm">{item.category}</p>
          <p className="text-sm">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {/* Smaller Decrease Button */}
        <button onClick={onDecreaseQuantity} className="bg-red-500 text-white px-2 py-1 text-xs rounded">
          -
        </button>
        <span>{item.quantity}</span>
        {/* Smaller Increase Button */}
        <button onClick={onIncreaseQuantity} className="bg-green-500 text-white px-2 py-1 text-xs rounded">
          +
        </button>
        <button onClick={onRemove} className="bg-gray-500 text-white px-2 py-1 text-xs rounded">
          Remove
        </button>
      </div>
    </div>
  );
};

const MyCarts = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Book', category: 'Books', description: 'A thrilling mystery novel', imageUrl: '/images/book.jpg', quantity: 1 },
    { id: 2, name: 'Laptop', category: 'Electronics', description: 'High-performance laptop', imageUrl: '/images/laptop.jpg', quantity: 1 },
    { id: 3, name: 'Chair', category: 'Furniture', description: 'Comfortable office chair', imageUrl: '/images/chair.jpg', quantity: 2 },
  ]);

  const [itemToRemove, setItemToRemove] = useState(null);
  const navigate = useNavigate();

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    setItemToRemove(null);
  };

  const handleIncreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const handleDecreaseQuantity = (id) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 } : item
    ));
  };

  const handleCheckout = () => {
    navigate('/loanform');
  };

  return (
    <div className="container mx-auto p-4 relative">
      {itemToRemove && (
        <ConfirmRemovalButtonComponent
          item={itemToRemove}
          onConfirm={() => handleRemoveItem(itemToRemove.id)}
          onCancel={() => setItemToRemove(null)}
        />
      )}

      <div className="flex items-center mb-6 space-x-4">
        <BackButton link="/previous-page" />
        <img src={CartLogo} alt="Cart" className="w-8 h-8" />
        <Typography variant="h4" className="font-bold">My Cart</Typography>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Typography variant="h6" className="mb-4">Your cart is empty</Typography>
          <Button color="blue" onClick={() => window.location.href = '/inventories'}>Go Back to Inventories</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {cartItems.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onIncreaseQuantity={() => handleIncreaseQuantity(item.id)}
              onDecreaseQuantity={() => handleDecreaseQuantity(item.id)}
              onRemove={() => setItemToRemove(item)}
            />
          ))}
          <div className="flex justify-end mt-4">
            <Button color="green" onClick={() => window.location.href = '/myborrow'}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCarts;
