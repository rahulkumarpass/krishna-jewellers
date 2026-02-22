import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Loader2, AlertCircle } from 'lucide-react';

const ProductGrid = () => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to track which filter tab is currently clicked
    const [activeCategory, setActiveCategory] = useState('All');

    // The categories that will appear as filter buttons
    const categories = ['All', "Men's Wear", "Women's Wear", "Kids Wear", "Accessories"];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();

                const formattedProducts = data.map(item => ({
                    id: item._id,
                    title: item.title,
                    category: item.category, // We need this to filter them locally!
                    image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/600',
                    price: item.price,
                    originalPrice: item.originalPrice,
                    discount: item.discount,
                    rating: item.rating || 4.5
                }));

                setAllProducts(formattedProducts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Could not load products at this time.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Filter the products before rendering them based on the active tab
    const displayedProducts = activeCategory === 'All'
        ? allProducts
        : allProducts.filter(product => product.category === activeCategory);

    return (
        <section className="my-10 bg-white p-6 shadow-sm rounded-sm">
            <div className="border-b border-gray-100 pb-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-3xl font-normal text-gray-800">Explore Our Collection</h2>

                {/* --- DYNAMIC FILTER TABS --- */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 hide-scrollbar">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${activeCategory === cat
                                    ? 'bg-brandBlue text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-10 text-brandBlue">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-medium text-gray-600">Loading latest collections...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex flex-col items-center justify-center py-10 text-red-500">
                    <AlertCircle size={40} className="mb-4" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Empty State */}
            {!loading && !error && displayedProducts.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-gray-500 text-lg">No products available in <strong>{activeCategory}</strong> right now.</p>
                </div>
            )}

            {/* Real Product Grid */}
            {!loading && !error && displayedProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default ProductGrid;