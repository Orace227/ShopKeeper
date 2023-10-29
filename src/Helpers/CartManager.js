import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { syncCartWithDatabase } from 'EndPoints/CreateOrder'; // Import the API function

export default function CartManager({ children }) {
  const location = useLocation();

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      syncCartWithDatabase(storedCart);
    } catch (error) { 
      // Handle the error (e.g., set a default value, log the error, or show a message to the user)
      console.error('Error parsing cart data from localStorage:', error);
      // You can set a default value or handle the error in another way
    }
  }, [location.pathname]);
  return <div>{children}</div>;
}
