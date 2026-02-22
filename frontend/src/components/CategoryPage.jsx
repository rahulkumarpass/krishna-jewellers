import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Loader2, AlertCircle, ArrowLeft, SlidersHorizontal } from 'lucide-react';

const CategoryPage = () => {
    const { categoryName } = useParams();

    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]); // Products currently shown on screen
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // New states for our extra filters
    const [priceFilter, setPriceFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('newest');

    const categoryMap = {
        'mens': "Men's Wear",
        'womens': "Women's Wear",
        'kids': "Kids Wear",
        'accessories': "Accessories"
    };

    const dbCategoryName = categoryMap[categoryName];

    // 1. Fetch the raw data from the database
    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();

                const filteredData = data.filter(item => item.category === dbCategoryName);

                const formattedProducts = filteredData.map(item => ({
                    id: item._id,
                    title: item.title,
                    image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/600',
                    price: item.price,
                    originalPrice: item.originalPrice,
                    discount: item.discount,
                    rating: item.rating || 4.5
                }));

                setProducts(formattedProducts);
                setDisplayedProducts(formattedProducts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching category:", err);
                setError("Could not load products for this category.");
                setLoading(false);
            }
        };

        if (dbCategoryName) {
            fetchCategoryProducts();
        } else {
            setError("Invalid category.");
            setLoading(false);
        }
    }, [categoryName, dbCategoryName]);

    // 2. Apply Price and Sort filters whenever the user changes the dropdowns
    useEffect(() => {
        let result = [...products];

        // Apply Price Range Filter
        if (priceFilter === 'under500') {
            result = result.filter(p => p.price < 500);
        } else if (priceFilter === '500to1000') {
            result = result.filter(p => p.price >= 500 && p.price <= 1000);
        } else if (priceFilter === 'over1000') {
            result = result.filter(p => p.price > 1000);
        }

        // Apply Sorting Order
        if (sortOrder === 'priceAsc') {
            result.sort((a, b) => a.price - b.price); // Low to High
        } else if (sortOrder === 'priceDesc') {
            result.sort((a, b) => b.price - a.price); // High to Low
        }
        // If 'newest', it stays in the default order fetched from DB

        setDisplayedProducts(result);
    }, [products, priceFilter, sortOrder]);

    return (
        <div className="my-10 bg-white p-6 shadow-sm rounded-sm min-h-[60vh]">

            {/* Category Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
                <Link to="/" className="text-gray-500 hover:text-brandBlue transition-colors cursor-pointer">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-normal text-gray-800">
                    {dbCategoryName || "Category Not Found"}
                </h2>
            </div>

            {/* --- NEW FILTER & SORT BAR --- */}
            {!loading && !error && products.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                        <SlidersHorizontal size={18} className="text-brandBlue" />
                        <span>Filter & Sort</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        {/* Price Filter */}
                        <select
                            value={priceFilter}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-sm focus:ring-brandBlue focus:border-brandBlue block w-full p-2"
                        >
                            <option value="all">Any Price</option>
                            <option value="under500">Under ₹500</option>
                            <option value="500to1000">₹500 - ₹1000</option>
                            <option value="over1000">Over ₹1000</option>
                        </select>

                        {/* Sort Dropdown */}
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-sm focus:ring-brandBlue focus:border-brandBlue block w-full p-2"
                        >
                            <option value="newest">Newest Arrivals</option>
                            <option value="priceAsc">Price: Low to High</option>
                            <option value="priceDesc">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-10 text-brandBlue">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-medium text-gray-600">Loading {dbCategoryName}...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex flex-col items-center justify-center py-10 text-red-500">
                    <AlertCircle size={40} className="mb-4" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Empty State (If no products are in this category at all) */}
            {!loading && !error && products.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">We don't have any items in the <strong>{dbCategoryName}</strong> category right now.</p>
                    <Link to="/" className="text-brandBlue font-medium mt-4 inline-block hover:underline">
                        Explore other collections
                    </Link>
                </div>
            )}

            {/* Empty State (If filters are too strict and hide everything) */}
            {!loading && !error && products.length > 0 && displayedProducts.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">No products match your selected filters.</p>
                    <button
                        onClick={() => { setPriceFilter('all'); setSortOrder('newest'); }}
                        className="text-brandBlue font-medium mt-4 inline-block hover:underline cursor-pointer"
                    >
                        Clear Filters
                    </button>
                </div>
            )}

            {/* Real Product Grid for the specific category */}
            {!loading && !error && displayedProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryPage;