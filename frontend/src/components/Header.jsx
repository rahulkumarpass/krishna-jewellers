import React, { useState } from 'react';
import { Search, User, Heart, ShoppingCart, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <header className="bg-brandBlue text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link to="/" className="text-xl md:text-2xl font-bold whitespace-nowrap">
                    Krishna Jewelry
                </Link>

                {/* Desktop Search Bar */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2.5 pl-4 pr-24 rounded-sm text-gray-800 focus:outline-none shadow-sm"
                    />

                    {/* Cancel (X) Button - Only shows if there is text */}
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    )}

                    {/* Search Icon Button */}
                    <button
                        type="submit"
                        className="absolute right-0 top-0 h-full px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-r-sm transition-colors cursor-pointer flex items-center justify-center"
                    >
                        <Search size={20} />
                    </button>
                </form>

                {/* Icons */}
                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/admin" className="flex items-center gap-1 hover:text-blue-100 transition-colors">
                        <User size={18} /> <span className="hidden sm:block">Login</span>
                    </Link>
                    <Link to="/wishlist" className="flex items-center gap-1 hover:text-blue-100 transition-colors">
                        <Heart size={18} /> <span className="hidden sm:block">Wishlist</span>
                    </Link>
                    <Link to="/cart" className="flex items-center gap-1 hover:text-blue-100 transition-colors">
                        <ShoppingCart size={18} /> <span className="hidden sm:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search - shows only on small screens */}
            <div className="md:hidden px-4 pb-3">
                <form onSubmit={handleSearch} className="flex w-full relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2 pl-4 pr-20 rounded-sm text-gray-800 focus:outline-none shadow-sm"
                    />
                    {searchTerm && (
                        <button type="button" onClick={clearSearch} className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500">
                            <X size={18} />
                        </button>
                    )}
                    <button type="submit" className="absolute right-0 top-0 h-full px-3 bg-blue-700 hover:bg-blue-800 text-white rounded-r-sm flex items-center justify-center cursor-pointer">
                        <Search size={18} />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;