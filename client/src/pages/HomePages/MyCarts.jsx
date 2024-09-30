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
        <button onClick={onDecreaseQuantity} className="bg-red-500 text-white px-2 py-1 text-xs rounded">
          -
        </button>
        <span>{item.quantity}</span>
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
    { id: 1, name: 'Book', category: 'Books', description: 'A thrilling mystery novel', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794', quantity: 1 },
    { id: 2, name: 'Laptop', category: 'Electronics', description: 'High-performance laptop', imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', quantity: 1 },
    { id: 3, name: 'Chair', category: 'Furniture', description: 'Comfortable office chair', imageUrl: 'https://images.unsplash.com/photo-1562183240-33d6d9d9d0e6', quantity: 2 },
  ]);

  const [itemToRemove, setItemToRemove] = useState(null);
  const [isCheckoutSuccessful, setIsCheckoutSuccessful] = useState(false);
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
    setIsCheckoutSuccessful(true);
    setTimeout(() => {
      setIsCheckoutSuccessful(false);
      navigate('/myborrow');
    }, 2000); // Redirect after 2 seconds
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
            <Button color="green" onClick={handleCheckout}>Checkout</Button>
          </div>
        </div>
      )}

      {isCheckoutSuccessful && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center">
            <div className="text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <Typography variant="h6" className="font-bold text-4xl mb-4">Checkout was Successful!</Typography>
            <Button color="green" onClick={() => setIsCheckoutSuccessful(false)}>Confirm</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCarts;