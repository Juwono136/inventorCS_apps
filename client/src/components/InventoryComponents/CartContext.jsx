import React, { createContext, useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const syncWithLocalStorage = (updatedCartItems) => {
    localStorage.setItem("cart", JSON.stringify(updatedCartItems));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cartItems.filter(item => item.asset_id !== itemId);
    setCartItems(updatedCart);
    syncWithLocalStorage(updatedCart);
    toast.success("Item has been removed");
  };

  const increaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item.asset_id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    syncWithLocalStorage(updatedCart);
  };

  const decreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map(item =>
      item.asset_id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
    );
    setCartItems(updatedCart);
    syncWithLocalStorage(updatedCart);
  };

  const addToCart = (item) => {
    const updatedCart = cartItems.some(cartItem => cartItem.asset_id === item.asset_id)
      ? cartItems.map(cartItem =>
          cartItem.asset_id === item.asset_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      : [...cartItems, { ...item, quantity: 1 }];
    setCartItems(updatedCart);
    syncWithLocalStorage(updatedCart);
    toast.success("Added to Cart Successfully!");
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};