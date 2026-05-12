// src/components/Navbar.jsx (Simplest)
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white shadow">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          
          <Link to="/" className="text-xl font-bold text-blue-600">
            Shortify
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className={`font-medium ${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            
            <Link
              to="/list"
              className={`font-medium ${
                location.pathname === '/list' ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;