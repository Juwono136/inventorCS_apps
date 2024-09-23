import React, { createContext, useState, useContext } from "react";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const removeFromCart = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.item_id !== itemId));
  };

  const increaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.item_id === itemId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.item_id === itemId ? { ...item, quantity: Math.max(item.quantity - 1, 0) } : item
      )
    );
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.item_id === item.item_id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.item_id === item.item_id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};