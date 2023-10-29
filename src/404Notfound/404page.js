import React from 'react';
import { NavLink } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl text-blue-500">404 - Page Not Found</h1>
      <p className="text-gray-600">The page you&apos;re looking for does not exist.</p>
      
     
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mt-4 rounded">
        <NavLink to="/">Back to Home</NavLink>
      </button>
    </div>
  );
};

export default NotFound;

