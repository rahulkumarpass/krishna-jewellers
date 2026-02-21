import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HeartCrack, ArrowLeft, Trash2 } from 'lucide-react';
import ProductCard from './ProductCard';

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);

    // Load items from localStorage when the page opens
    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];
        setWishlistItems(savedWishlist);
    }, []);

    // Function to remove an item from the wishlist
    const removeFromWishlist = (idToRemove) => {
        const updatedWishlist = wishlistItems.filter(item => item.id !== idToRemove);
        setWishlistItems(updatedWishlist);
        localStorage.setItem('krishna_wishlist', JSON.stringify(updatedWishlist));
    };

    return (
        <div className="my-10 bg-white p-6 shadow-sm rounded-sm min-h-[60vh]">

            {/* Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-8">
                <Link to="/" className="text-gray-500 hover:text-brandBlue transition-colors cursor-pointer">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-normal text-gray-800">My Wishlist</h2>
            </div>

            {/* Empty State */}
            {wishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <HeartCrack size={48} className="mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Your wishlist is currently empty.</p>
                    <p className="text-sm mt-2 mb-6">Save items you love to easily find them later!</p>
                    <Link to="/" className="bg-brandBlue text-white px-6 py-2 rounded-sm font-medium hover:bg-blue-700 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                /* Wishlist Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((product) => (
                        <div key={product.id} className="relative group">
                            {/* We reuse your awesome ProductCard */}
                            <ProductCard product={product} />

                            {/* Remove Button overlay */}
                            <button
                                onClick={() => removeFromWishlist(product.id)}
                                className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors z-10 cursor-pointer flex items-center gap-1"
                                title="Remove from Wishlist"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;