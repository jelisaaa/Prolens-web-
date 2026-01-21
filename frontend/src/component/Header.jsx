import React from "react";
import { Link } from "react-router-dom";

import Logo from "../assets/Logo.png";
const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        <Link to="/" className="flex items-center space-x-2">
          <img
          src={Logo}
          alt="Logo"
          className="h-15 w-auto"
          />
        </Link>

        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-600">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <Link to="/cameras" className="hover:text-black transition-colors">Cameras</Link>
          <Link to="/lenses" className="hover:text-black transition-colors">Lenses</Link>
          <Link to="/about" className="hover:text-black transition-colors">About</Link>
        </nav>

        
        <div className="flex items-center space-x-5">
          <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-black">
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="text-sm font-semibold text-gray-600 hover:text-black">
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;