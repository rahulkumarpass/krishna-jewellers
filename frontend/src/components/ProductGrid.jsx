import React from 'react';
import ProductCard from './ProductCard'; // We are keeping the great product cards!

const ProductGrid = () => {
    // Temporary data until we connect to your Node.js backend
    const products = [
        {
            id: 1,
            title: "Men's Premium Checked Shirt",
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop",
            price: 499, originalPrice: 999, discount: 50, rating: 4.4
        },
        {
            id: 2,
            title: "Gold Plated Bridal Necklace",
            image: "https://images.unsplash.com/photo-1599643478524-fb66ba45363b?q=80&w=600&auto=format&fit=crop",
            price: 1299, originalPrice: 2599, discount: 50, rating: 4.8
        },
        {
            id: 3,
            title: "Women's Casual Denim Jacket",
            image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600&auto=format&fit=crop",
            price: 899, originalPrice: 1499, discount: 40, rating: 4.5
        },
        {
            id: 4,
            title: "Designer Black Sunglasses",
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop",
            price: 449, originalPrice: 699, discount: 35, rating: 4.3
        },
    ];

    return (
        <section className="my-10 bg-white p-6 shadow-sm rounded-sm">
            {/* Clean, simple section header without the timer */}
            <div className="border-b border-gray-100 pb-4 mb-8">
                <h2 className="text-3xl font-normal text-gray-800 text-center">Explore Our Collection</h2>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default ProductGrid;