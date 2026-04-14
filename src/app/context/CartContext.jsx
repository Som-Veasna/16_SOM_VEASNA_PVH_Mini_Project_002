"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cart");
    }
  }, [cartItems]);

  const addToCart = (product, color = null, size = null) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => 
        item.productId === product.productId && 
        item.color === color && 
        item.size === size
      );
      
      if (existingItem) {
        return prevItems.map((item) =>
          item.productId === product.productId && 
          item.color === color && 
          item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1, color, size }];
      }
    });
  };

  const removeFromCart = (productId, color = null, size = null) => {
    setCartItems((prevItems) => 
      prevItems.filter((item) => 
        item.productId !== productId || 
        item.color !== color || 
        item.size !== size
      )
    );
  };

  const updateQuantity = (productId, color = null, size = null, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && 
        item.color === color && 
        item.size === size
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalQuantity,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
