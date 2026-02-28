
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaShoppingCart,
  FaTruck,
  FaSignOutAlt,
  FaTrash,
  FaKey,
} from "react-icons/fa";

import { logout } from "../../services/auth";

const HeaderCard = ({ user }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full md:w-72 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 overflow-hidden">
      
      {/* User Info Section */}
      <div className="flex flex-col items-center mb-8 pb-6 border-b border-slate-100">
        <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl font-black text-slate-400 shadow-inner mb-4">
          {user?.username?.charAt(0).toUpperCase()}
        </div>
        
        <h2 className="font-black text-slate-950 tracking-tight text-lg leading-none">
          {user?.username}
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-2 mb-3">
          {user?.email}
        </p>
        
        <Link 
          to="/editprofile" 
          className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-colors"
        >
          Edit Profile → 
        </Link>
      </div>

      <nav className="flex flex-col gap-1">
        <MenuLink to="/profile" icon={<FaUser />} label="Profile" active={isActive("/profile")} />
        <MenuLink to="/orders" icon={<FaBoxOpen />} label="Orders" active={isActive("/orders")} />
        <MenuLink to="/viewcart" icon={<FaShoppingCart />} label="My Cart" active={isActive("/viewcart")} />
        <MenuLink to="/shipping" icon={<FaTruck />} label="Shipping" active={isActive("/shipping")} />
        
        <div className="my-4 border-t border-slate-50"></div>

        <MenuLink to="/changepassword" icon={<FaKey />} label="Update Password" variant="danger" />
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:bg-slate-50 hover:text-red-500 rounded-xl transition-all"
        >
          <FaSignOutAlt size={14} /> Logout
        </button>

        <Link 
          to="/delete-account" 
          className="flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-300 hover:text-red-600 transition-colors mt-4"
        >
          <FaTrash size={12} /> Delete Account
        </Link>
      </nav>
    </div>
  );
};

const MenuLink = ({ to, icon, label, active, variant = "default" }) => {
  const baseStyles = "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-xl transition-all";
  const variants = {
    default: active 
      ? "bg-slate-950 text-white shadow-lg shadow-slate-200" 
      : "text-slate-500 hover:bg-slate-50 hover:text-slate-950",
    danger: "text-slate-400 hover:bg-red-50 hover:text-red-500"
  };

  return (
    <Link to={to} className={`${baseStyles} ${variants[variant]}`}>
      <span className={active ? "text-white" : "opacity-50"}>{icon}</span>
      {label}
    </Link>
  );
};

export default HeaderCard;