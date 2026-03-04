import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";
import Logo from "../assets/Logo.png";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="inline-block">
              <img src={Logo} alt="ProLens Logo" className="h-12 w-auto" />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-xs">
              Redefining cinema rentals through precision optics and elite support for the modern filmmaker.
            </p>
            <div className="flex space-x-4 text-gray-400">
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-6">Inventory</h4>
            <ul className="space-y-4">
              <FooterLink to="/products" label="Digital Cinema" />
              <FooterLink to="/products" label="Prime Lenses" />
              <FooterLink to="/products" label="Anamorphic Gear" />
              <FooterLink to="/products" label="Stabilization" />
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-6">Support</h4>
            <ul className="space-y-4">
              <FooterLink to="/about" label="Our Story" />
              <FooterLink to="#" label="Shipping Policy" />
              <FooterLink to="#" label="Insurance Cover" />
              <FooterLink to="#" label="Terms of Service" />
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-black mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-sm text-gray-500 font-medium">
                <MapPin size={16} className="text-gray-300" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-500 font-medium">
                <Phone size={16} className="text-gray-300" />
                <span>+977 1 4567890</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-gray-500 font-medium">
                <Mail size={16} className="text-gray-300" />
                <span>rentals@prolens.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
            © 2026 ProLens Vault. All Rights Reserved.
          </p>
          <div className="flex space-x-8 text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-black transition-colors">Privacy</a>
            <a href="#" className="hover:text-black transition-colors">Cookies</a>
            <a href="#" className="hover:text-black transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

/* --- Helper Components --- */

const FooterLink = ({ to, label }) => (
  <li>
    <Link 
      to={to} 
      className="text-sm font-semibold text-gray-500 hover:text-black transition-colors"
    >
      {label}
    </Link>
  </li>
);

const SocialIcon = ({ icon }) => (
  <a 
    href="#" 
    className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
  >
    {icon}
  </a>
);

export default Footer;