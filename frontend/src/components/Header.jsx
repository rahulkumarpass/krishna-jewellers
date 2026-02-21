import React from 'react';
import { Search, User, Heart, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className="bg-brandBlue py-3 sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">

                {/* Logo */}
                <Link to="/" className="text-white text-xl md:text-2xl font-bold tracking-wide">
                    Krishna Jewelry and Readymade
                </Link>

                {/* Search Bar */}
                <div className="flex w-full md:max-w-xl bg-white rounded-sm shadow-sm overflow-hidden">
                    <input
                        type="text"
                        placeholder="Search for products, brands and more"
                        className="w-full px-4 py-2 outline-none text-sm text-gray-700"
                    />
                    <button className="px-4 text-brandBlue bg-white flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                        <Search size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-6 text-white font-medium text-sm">
                    {/* Login - Visually Disabled */}
                    <span className="flex items-center gap-1 opacity-50 cursor-not-allowed" title="Login is currently disabled">
                        <User size={18} /> Login
                    </span>

                    {/* Wishlist */}
                    <Link to="/wishlist" className="flex items-center gap-1 hover:opacity-80">
                        <Heart size={18} /> Wishlist
                    </Link>

                    {/* Cart - Visually Disabled */}
                    <span className="flex items-center gap-1 opacity-50 cursor-not-allowed" title="Cart is currently disabled">
                        <ShoppingCart size={18} /> Cart
                    </span>
                </div>

            </div>
        </header>
    );
};

export default Header;