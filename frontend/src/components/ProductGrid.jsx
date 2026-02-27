import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Loader2, AlertCircle } from 'lucide-react';

const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // === NEW: Memory to track saved items ===
    const [savedItemIds, setSavedItemIds] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) throw new Error('Failed to fetch products');
                const data = await response.json();
                setProducts(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // === NEW: Auto-sync wishlist memory ===
    useEffect(() => {
        const syncWishlist = () => {
            const currentWishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];
            setSavedItemIds(currentWishlist.map(item => item.id));
        };
        syncWishlist();
        const interval = setInterval(syncWishlist, 500);
        return () => clearInterval(interval);
    }, []);

    // === NEW: Toggle Heart Logic ===
    const handleToggleWishlist = (e, product) => {
        e.preventDefault(); // Prevents clicking the card link
        let currentWishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];

        const exists = currentWishlist.find(item => item.id === product._id);

        if (exists) {
            // Remove it
            currentWishlist = currentWishlist.filter(item => item.id !== product._id);
        } else {
            // Add it
            currentWishlist.push({
                id: product._id,
                title: product.title,
                image: product.images?.[0] || 'https://via.placeholder.com/600',
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount
            });
        }

        localStorage.setItem('krishna_wishlist', JSON.stringify(currentWishlist));
        // Force immediate update
        setSavedItemIds(currentWishlist.map(item => item.id));
    };

    if (loading) return <div className="flex justify-center py-20 text-brandBlue"><Loader2 size={40} className="animate-spin" /></div>;
    if (error) return <div className="flex justify-center py-20 text-red-500"><AlertCircle size={40} /> Error: {error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 border-b pb-4">Explore Our Collection</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {products.map((product) => {

                    // Check if this specific product is in the saved memory array
                    const isSaved = savedItemIds.includes(product._id);

                    return (
                        <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group relative flex flex-col">

                            <Link to={`/product/${product._id}`} className="relative h-48 md:h-60 overflow-hidden bg-gray-50 block">
                                <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/600'}
                                    alt={product.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </Link>

                            {/* === UPDATED HEART BUTTON === */}
                            <button
                                onClick={(e) => handleToggleWishlist(e, product)}
                                className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:scale-110 transition-transform cursor-pointer z-10"
                            >
                                <Heart
                                    size={18}
                                    className={isSaved ? "text-red-500 fill-red-500" : "text-gray-400 hover:text-red-500"}
                                />
                            </button>

                            <Link to={`/product/${product._id}`} className="p-4 flex flex-col flex-grow">
                                {product.rating && (
                                    <div className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1 w-max mb-2">
                                        {product.rating} ★
                                    </div>
                                )}

                                <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{product.title}</h3>

                                <div className="flex items-center gap-2 mb-3 mt-auto">
                                    <span className="font-bold text-gray-900">₹{product.price}</span>
                                    {product.originalPrice && (
                                        <span className="text-xs text-gray-400 line-through">₹{product.originalPrice}</span>
                                    )}
                                    {product.discount && (
                                        <span className="text-xs font-semibold text-green-600">{product.discount}% off</span>
                                    )}
                                </div>

                                <button className="w-full bg-blue-50 text-brandBlue py-2 rounded-lg text-sm font-semibold hover:bg-brandBlue hover:text-white transition-colors">
                                    View Details
                                </button>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProductGrid;