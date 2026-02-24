import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { MessageCircle, MapPin, Phone, CheckCircle2, XCircle, Loader2, Clock, Heart, AlertCircle, ArrowLeft, User, ShoppingCart } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Check if a user is currently logged in
    const currentUser = JSON.parse(localStorage.getItem('krishna_user'));

    const [product, setProduct] = useState(null);
    const [shopSettings, setShopSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for selected size
    const [selectedSize, setSelectedSize] = useState(null);

    // States for delivery checking
    const [deliveryStatus, setDeliveryStatus] = useState('idle');
    const [distance, setDistance] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!productRes.ok) throw new Error('Product not found');
                const productData = await productRes.json();
                setProduct(productData);

                // Auto-select the first available size if inventory exists
                if (productData.inventory && productData.inventory.length > 0) {
                    const availableSize = productData.inventory.find(i => i.quantity > 0);
                    if (availableSize) setSelectedSize(availableSize.size);
                }

                const settingsRes = await fetch('http://localhost:5000/api/settings');
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    setShopSettings(settingsData);
                }
                setLoading(false);
            } catch (err) {
                setError("Could not load product details.");
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Delivery Location Math
    const SHOP_LAT = 25.98;
    const SHOP_LON = 85.33;
    const MAX_DELIVERY_RADIUS_KM = 5;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const checkDeliveryLocation = () => {
        setDeliveryStatus('checking');
        if (!navigator.geolocation) return setDeliveryStatus('error');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const dist = calculateDistance(position.coords.latitude, position.coords.longitude, SHOP_LAT, SHOP_LON);
                setDistance(dist.toFixed(1));
                setDeliveryStatus(dist <= MAX_DELIVERY_RADIUS_KM ? 'success' : 'out-of-range');
            },
            () => setDeliveryStatus('error'),
            { enableHighAccuracy: true }
        );
    };

    // Add to Cart Logic with Stock Limits
    const handleAddToCart = () => {
        if (!selectedSize) {
            alert("Please select a size first!");
            return;
        }

        const currentCart = JSON.parse(localStorage.getItem('krishna_cart')) || [];
        const existingItemIndex = currentCart.findIndex(item => item.id === product._id && item.selectedSize === selectedSize);

        // Find the exact stock limit for the size they selected
        const sizeInfo = product.inventory.find(i => i.size === selectedSize);
        const maxStock = sizeInfo ? sizeInfo.quantity : 0;

        if (existingItemIndex >= 0) {
            // Check if adding one more exceeds the stock limit
            if (currentCart[existingItemIndex].quantity < maxStock) {
                currentCart[existingItemIndex].quantity += 1;
            } else {
                alert(`Sorry, you can't add more. We only have ${maxStock} left in this size!`);
                return; // Stop here so it doesn't save
            }
        } else {
            currentCart.push({
                id: product._id,
                title: product.title,
                serialNo: product.serialNo,
                image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600',
                price: product.price,
                selectedSize: selectedSize,
                quantity: 1,
                maxQuantity: maxStock // SAVE THE LIMIT TO THE CART
            });
        }

        localStorage.setItem('krishna_cart', JSON.stringify(currentCart));
        alert(`${product.title} (Size: ${selectedSize}) added to cart!`);
    };

    const handleWishlist = () => {
        if (!product) return;
        let currentWishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];
        if (!currentWishlist.find(item => item.id === product._id)) {
            currentWishlist.push({ id: product._id, title: product.title, image: product.images?.[0] || '', price: product.price, originalPrice: product.originalPrice, discount: product.discount });
            localStorage.setItem('krishna_wishlist', JSON.stringify(currentWishlist));
            alert(`${product.title} added to Wishlist!`);
        } else {
            alert(`${product.title} is already in your Wishlist!`);
        }
    };

    if (loading) return <div className="flex justify-center py-20 text-brandBlue"><Loader2 size={48} className="animate-spin" /></div>;
    if (error || !product) return <div className="flex justify-center py-20 text-red-500"><AlertCircle size={48} /> {error}</div>;

    const shopPhone = shopSettings?.owners?.[0]?.phone || "919876543210";
    const displayAddress = shopSettings?.address || "X8MM+3VW, Kurhani, Bihar 844120";
    const whatsappMessage = encodeURIComponent(`Hi, I'm interested in purchasing: ${product.title} (Serial No: ${product.serialNo})`);
    const currentHour = new Date().getHours();
    const isContactable = currentHour >= 8 && currentHour < 20;

    return (
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-gray-100 my-6 flex flex-col md:flex-row gap-8">

            {/* Left Column - Images */}
            <div className="w-full md:w-5/12">
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                    {product.images?.length > 0 ? (
                        <Swiper pagination={{ clickable: true }} navigation={true} modules={[Pagination, Navigation]} className="w-full h-[400px] md:h-[500px]">
                            {product.images.map((img, index) => (
                                <SwiperSlide key={index}><img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" /></SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center text-gray-400">No images available</div>
                    )}
                </div>
            </div>

            {/* Right Column - Product Details */}
            <div className="w-full md:w-7/12 flex flex-col">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500 mb-4">Serial No: <span className="font-bold text-gray-800">{product.serialNo}</span></p>

                <div className="flex items-center gap-1 bg-green-100 text-green-800 text-sm font-bold px-2.5 py-1 rounded-md w-max mb-4">
                    {product.rating || 4.5} ★
                </div>

                <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                    <span className="text-lg text-green-600 font-semibold mb-1">{product.discount}% off</span>
                </div>

                {/* Delivery Location Check */}
                <div className={`mb-6 p-4 rounded-lg border flex flex-col gap-2 transition-colors shadow-sm ${deliveryStatus === 'success' ? 'bg-green-50 border-green-200' :
                        deliveryStatus === 'out-of-range' ? 'bg-red-50 border-red-200' :
                            'bg-blue-50 border-blue-100'
                    }`}>
                    <div className="flex items-center gap-2 font-semibold text-gray-800">
                        <MapPin size={20} className={
                            deliveryStatus === 'success' ? 'text-green-600' :
                                deliveryStatus === 'out-of-range' ? 'text-red-500' : 'text-brandBlue'
                        } />
                        Delivery Status
                    </div>

                    {deliveryStatus === 'idle' && (
                        <>
                            <p className="text-sm text-gray-600">We deliver within a 5km radius of our shop.</p>
                            <button onClick={checkDeliveryLocation} className="mt-2 bg-white border border-brandBlue text-brandBlue py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-50 transition-colors w-max cursor-pointer shadow-sm">
                                Check My Location
                            </button>
                        </>
                    )}

                    {deliveryStatus === 'checking' && (
                        <div className="flex items-center gap-2 text-brandBlue text-sm mt-2 font-medium">
                            <Loader2 size={16} className="animate-spin" /> Calculating distance...
                        </div>
                    )}

                    {deliveryStatus === 'success' && (
                        <div className="flex items-start gap-2 text-green-800 text-sm mt-1">
                            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-green-600" />
                            <p>Great news! You are exactly <strong>{distance}km</strong> away. We can deliver this to you.</p>
                        </div>
                    )}

                    {deliveryStatus === 'out-of-range' && (
                        <div className="flex items-start gap-2 text-red-800 text-sm mt-1">
                            <XCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                            <div>
                                <p>You are <strong>{distance}km</strong> away from our shop. (Delivery limit is 5km).</p>
                                <p className="mt-1 font-semibold text-gray-900">Please visit our store to purchase this item!</p>
                            </div>
                        </div>
                    )}

                    {deliveryStatus === 'error' && (
                        <p className="text-sm text-red-600 mt-1 font-medium">Unable to access your location. Please ensure location services are enabled.</p>
                    )}
                </div>

                {/* INTERACTIVE SIZES */}
                {product.inventory && product.inventory.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Select Size</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.inventory.map((item) => (
                                <button
                                    key={item.size}
                                    onClick={() => item.quantity > 0 && setSelectedSize(item.size)}
                                    disabled={item.quantity <= 0}
                                    className={`flex flex-col border rounded-md overflow-hidden min-w-[80px] shadow-sm transition-all cursor-pointer ${item.quantity <= 0 ? 'opacity-50 cursor-not-allowed' :
                                            selectedSize === item.size ? 'border-brandBlue ring-2 ring-blue-100' : 'border-gray-200 hover:border-brandBlue'
                                        }`}
                                >
                                    <div className={`text-center py-2 font-bold ${selectedSize === item.size ? 'bg-blue-50 text-brandBlue' : 'bg-gray-50 text-gray-800'}`}>
                                        {item.size}
                                    </div>
                                    <div className={`text-center py-1 text-xs font-semibold ${item.quantity > 0 ? 'bg-white text-green-700 border-t border-gray-100' : 'bg-red-50 text-red-600 border-t border-red-100'}`}>
                                        {item.quantity > 0 ? `${item.quantity} Left` : 'Sold Out'}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>

                {/* CART & WISHLIST BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <button onClick={handleAddToCart} className="flex-1 bg-brandBlue text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-md cursor-pointer">
                        <ShoppingCart size={20} /> Add to Cart
                    </button>
                    <button onClick={handleWishlist} className="sm:w-1/3 bg-red-50 border border-red-200 text-red-500 py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-red-100 transition-all shadow-sm cursor-pointer">
                        <Heart size={20} /> Wishlist
                    </button>
                </div>

                {/* AUTH PROTECTED CONTACT BUTTONS */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {!currentUser ? (
                        <button onClick={() => navigate('/login')} className="w-full bg-gray-800 text-white py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-sm cursor-pointer">
                            <User size={20} /> Login for Bulk Enquiries & Direct Chat
                        </button>
                    ) : isContactable ? (
                        <>
                            <a href={`https://wa.me/${shopPhone}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all shadow-sm cursor-pointer">
                                <MessageCircle size={20} /> Chat on WhatsApp
                            </a>
                            <a href={`tel:+${shopPhone}`} className="flex-1 bg-brandBlue text-white py-3.5 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm cursor-pointer">
                                <Phone size={20} /> Call Now
                            </a>
                        </>
                    ) : (
                        <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 py-3.5 rounded-lg font-medium flex flex-col items-center justify-center cursor-not-allowed shadow-inner">
                            <span className="flex items-center gap-2 text-gray-700"><Clock size={18} /> Closed (8 AM - 8 PM)</span>
                        </div>
                    )}
                </div>

                {/* Shop Location Map */}
                <div className="mt-10 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin size={20} className="text-brandBlue" /> Shop Location
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        <strong>Krishna Jewelry and Readymade</strong><br />
                        {displayAddress}
                    </p>
                    <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <iframe src="https://maps.google.com/maps?q=25.98,85.33&hl=en&z=14&output=embed" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Shop Location Map"></iframe>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;