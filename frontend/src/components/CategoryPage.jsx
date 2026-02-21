import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const CategoryPage = () => {
    const { categoryName } = useParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // We map the URL path (e.g., 'mens') to the exact string stored in your MongoDB database
    const categoryMap = {
        'mens': "Men's Wear",
        'womens': "Women's Wear",
        'kids': "Kids Wear",
        'accessories': "Accessories"
    };

    const dbCategoryName = categoryMap[categoryName];

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                setLoading(true);
                // Fetch all products from the database
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();

                // Filter the products so we ONLY keep the ones that match this category
                const filteredData = data.filter(item => item.category === dbCategoryName);

                // Format them for the ProductCard
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
                setLoading(false);
            } catch (err) {
                console.error("Error fetching category:", err);
                setError("Could not load products for this category.");
                setLoading(false);
            }
        };

        // Only run this if we have a valid category mapping
        if (dbCategoryName) {
            fetchCategoryProducts();
        } else {
            setError("Invalid category.");
            setLoading(false);
        }
    }, [categoryName, dbCategoryName]); // Re-run if the user clicks a different category URL

    return (
        <div className="my-10 bg-white p-6 shadow-sm rounded-sm min-h-[60vh]">

            {/* Category Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-8">
                <Link to="/" className="text-gray-500 hover:text-brandBlue transition-colors cursor-pointer">
                    <ArrowLeft size={24} />
                </Link>
                <h2 className="text-3xl font-normal text-gray-800">
                    {dbCategoryName || "Category Not Found"}
                </h2>
            </div>

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

            {/* Empty State (If no products are in this category yet) */}
            {!loading && !error && products.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">We don't have any items in the <strong>{dbCategoryName}</strong> category right now.</p>
                    <Link to="/" className="text-brandBlue font-medium mt-4 inline-block hover:underline">
                        Explore other collections
                    </Link>
                </div>
            )}

            {/* Real Product Grid for the specific category */}
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

export default CategoryPage;