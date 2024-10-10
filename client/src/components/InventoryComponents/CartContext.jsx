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
    const itemToUpdate = cartItems.find(item => item.asset_id === itemId);
  
    if (itemToUpdate.quantity + 1 > itemToUpdate.total_items) {
      toast.error("Cannot exceed available stock");
      return;
    }
  
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
    const existingCartItem = cartItems.find(cartItem => cartItem.asset_id === item.asset_id);
  
    if (existingCartItem) {
      if (existingCartItem.quantity + 1 > item.total_items) {
        toast.error("Cannot add more than available stock");
        return;
      }
  
      const updatedCart = cartItems.map(cartItem =>
        cartItem.asset_id === item.asset_id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
      setCartItems(updatedCart);
      syncWithLocalStorage(updatedCart);
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
      syncWithLocalStorage([...cartItems, { ...item, quantity: 1 }]);
    }
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