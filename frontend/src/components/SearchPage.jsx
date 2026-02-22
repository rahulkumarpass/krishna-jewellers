import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Loader2, AlertCircle, SearchX } from 'lucide-react';

const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Extract the search query from the URL
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q') || '';

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch all products from the database
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();

                // Safety check: ensure 'data' is an array before filtering
                if (!Array.isArray(data)) {
                    throw new Error("Invalid data format received from server");
                }

                // Filter products locally based on the search term
                const searchTerm = query.toLowerCase().trim();
                const filteredData = data.filter(item =>
                    (item.title && item.title.toLowerCase().includes(searchTerm)) ||
                    (item.category && item.category.toLowerCase().includes(searchTerm)) ||
                    (item.description && item.description.toLowerCase().includes(searchTerm))
                );

                const formattedProducts = filteredData.map(item => ({
                    id: item._id,
                    title: item.title,
                    category: item.category,
                    image: item.images && item.images.length > 0 ? item.images[0] : 'https://via.placeholder.com/600',
                    price: item.price,
                    originalPrice: item.originalPrice,
                    discount: item.discount,
                    rating: item.rating || 4.5
                }));

                setProducts(formattedProducts);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError("Could not load products at this time.");
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        } else {
            setProducts([]);
            setLoading(false);
        }
    }, [query]);

    return (
        <div className="my-10 bg-white p-6 shadow-sm rounded-lg min-h-[60vh]">

            {/* Search Header */}
            <div className="border-b border-gray-100 pb-4 mb-6">
                <h2 className="text-2xl font-normal text-gray-800">
                    Search Results for: <span className="font-semibold text-brandBlue">"{query}"</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">Found {products.length} items</p>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex flex-col items-center justify-center py-10 text-brandBlue">
                    <Loader2 size={40} className="animate-spin mb-4" />
                    <p className="font-medium text-gray-600">Searching store...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex flex-col items-center justify-center py-10 text-red-500">
                    <AlertCircle size={40} className="mb-4" />
                    <p className="font-medium">{error}</p>
                </div>
            )}

            {/* Empty State (No Matches) */}
            {!loading && !error && products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <SearchX size={64} className="text-gray-300 mb-4" />
                    <p className="text-xl text-gray-600 font-medium">No results found for "{query}"</p>
                    <p className="text-gray-400 mt-2">Try checking your spelling or using more general terms.</p>
                    <Link to="/" className="mt-6 bg-brandBlue text-white px-6 py-2.5 rounded-md font-medium hover:bg-blue-700 transition-colors shadow-sm">
                        Continue Shopping
                    </Link>
                </div>
            )}

            {/* Results Grid */}
            {!loading && !error && products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPage;