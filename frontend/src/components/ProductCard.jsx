import React from 'react';
import { MessageCircle, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {

  // Save item to localStorage Wishlist
  const handleWishlist = (e) => {
    e.preventDefault();

    let currentWishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];
    const exists = currentWishlist.find(item => item.id === product.id);

    if (!exists) {
      currentWishlist.push(product);
      localStorage.setItem('krishna_wishlist', JSON.stringify(currentWishlist));
      alert(`${product.title} added to wishlist!`);
    } else {
      alert(`${product.title} is already in your wishlist!`);
    }
  };

  return (
    <div className="border border-gray-200 rounded-sm hover:shadow-lg transition-shadow duration-300 bg-white overflow-hidden flex flex-col relative">

      {/* Clickable Image Container */}
      <div className="relative h-64 overflow-hidden group">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Floating Add to Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors z-10 cursor-pointer"
          title="Add to Wishlist"
        >
          <Heart size={18} />
        </button>
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-sm w-max mb-2">
          {product.rating} ★
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="text-gray-800 font-medium truncate mb-1 hover:text-brandBlue transition-colors" title={product.title}>
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-black font-bold text-lg">₹{product.price}</span>
          <span className="text-gray-500 line-through text-sm">₹{product.originalPrice}</span>
          <span className="text-green-600 font-medium text-sm">{product.discount}% off</span>
        </div>

        <Link to={`/product/${product.id}`} className="mt-auto w-full bg-brandBlue text-white py-2 rounded-sm font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors cursor-pointer">
          <MessageCircle size={18} /> View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;