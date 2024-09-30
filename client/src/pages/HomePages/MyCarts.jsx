import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useCart } from '../../components/InventoryComponents/CartContext';
import CartItem from '../../components/HomeComponents/CartItem';
import CartLogo from '../../assets/images/cartlogo.png';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';

const MyCarts = () => {
  const { cartItems, setCartItems } = useCart([]);
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/loanform');
  };

  return (
    <div className="container mx-auto p-4 relative">
      
      <div className="flex items-center mb-6">
        <Link
          to="/inventory"
        >
          <FaArrowLeft />
        </Link>
        <img src={CartLogo} alt="Cart" className="w-8 h-8 mr-2" />
        <Typography variant="h4" className="font-bold">My Cart</Typography>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Typography variant="h6" className="mb-4">Your cart is empty</Typography>
          <Button color="blue" onClick={() => window.location.href = '/inventory'}>Go Back to Inventories</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          <CartItem
            key={cartItems.asset_id}
            items={cartItems}
          />
          <div className="flex justify-end mt-4">
            <Button color="green" onClick={handleCheckout}>Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCarts;