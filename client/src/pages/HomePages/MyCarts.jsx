import React from 'react';
import { Typography, Button } from "@material-tailwind/react";
import { useCart } from '../../components/InventoryComponents/CartContext';
import CartItem from '../../components/HomeComponents/CartItem';
import CartLogo from '../../assets/images/cartlogo.png';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa6';
import BackButton from '../../common/BackButton';
import ConfirmRemovalButtonComponent from '../../components/HomeComponents/ConfirmRemovalButtonComponent';

const MyCarts = () => {
  const { cartItems, setCartItems } = useCart([]);
  const navigate = useNavigate();
  const [isCheckoutSuccessful, setIsCheckoutSuccessful] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutSuccessful(true);
    setTimeout(() => {
      setIsCheckoutSuccessful(false);
      navigate('/myborrow');
    }, 2000);
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