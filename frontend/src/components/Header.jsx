import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingCart, X, LogOut } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    // === NEW: Badge States ===
    const [wishlistCount, setWishlistCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();
    const location = useLocation();

    // Check for user login
    useEffect(() => {
        const userString = localStorage.getItem('krishna_user');
        if (userString) {
            setCurrentUser(JSON.parse(userString));
        } else {
            setCurrentUser(null);
        }
    }, [location]);

    // === NEW: Auto-updating Badges ===
    useEffect(() => {
        const updateBadges = () => {
            const wishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];
            const cart = JSON.parse(localStorage.getItem('krishna_cart')) || [];

            setWishlistCount(wishlist.length);

            // Calculate total items in cart
            const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalCartItems);
        };

        updateBadges(); // Run once on load

        // Check for updates every half-second so it feels instant!
        const interval = setInterval(updateBadges, 500);
        return () => clearInterval(interval);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('krishna_user');
        setCurrentUser(null);
        navigate('/');
    };

    return (
        <header className="bg-brandBlue text-white sticky top-0 z-50 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">

                <Link to="/" className="text-xl md:text-2xl font-bold whitespace-nowrap">
                    Krishna Jewelry
                </Link>

                <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl relative">
                    <input
                        type="text"
                        placeholder="Search for products, brands and more..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full py-2.5 pl-4 pr-24 rounded-sm text-gray-800 focus:outline-none shadow-sm"
                    />
                    {searchTerm && (
                        <button type="button" onClick={() => setSearchTerm('')} className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                            <X size={18} />
                        </button>
                    )}
                    <button type="submit" className="absolute right-0 top-0 h-full px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-r-sm transition-colors cursor-pointer flex items-center justify-center">
                        <Search size={20} />
                    </button>
                </form>

                <div className="flex items-center gap-5 sm:gap-6 text-sm font-medium">

                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-blue-100" title={currentUser.name}>
                                <User size={18} />
                                <span className="hidden sm:block truncate max-w-[80px]">
                                    {currentUser.name.split(' ')[0]}
                                </span>
                            </div>
                            <button onClick={handleLogout} className="flex items-center gap-1 text-blue-200 hover:text-white transition-colors cursor-pointer" title="Logout">
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 hover:text-blue-100 transition-colors">
                            <User size={18} /> <span className="hidden sm:block">Login</span>
                        </Link>
                    )}

                    {/* === UPDATED WISHLIST BUTTON WITH BADGE === */}
                    <Link to="/wishlist" className="relative flex items-center gap-1 hover:text-blue-100 transition-colors">
                        <Heart size={18} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                                {wishlistCount}
                            </span>
                        )}
                        <span className="hidden sm:block">Wishlist</span>
                    </Link>

                    {/* === UPDATED CART BUTTON WITH BADGE === */}
                    <Link to="/cart" className="relative flex items-center gap-1 hover:text-blue-100 transition-colors">
                        <ShoppingCart size={18} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-sm">
                                {cartCount}
                            </span>
                        )}
                        <span className="hidden sm:block">Cart</span>
                    </Link>

                </div>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                <form onSubmit={handleSearch} className="flex w-full relative">
                    <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-4 pr-20 rounded-sm text-gray-800 focus:outline-none shadow-sm" />
                    <button type="submit" className="absolute right-0 top-0 h-full px-3 bg-blue-700 text-white rounded-r-sm flex items-center justify-center cursor-pointer">
                        <Search size={18} />
                    </button>
                </form>
            </div>
        </header>
    );
};

export default Header;