import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { MessageCircle, MapPin, Phone, CheckCircle2, XCircle, Loader2, Clock, Heart, AlertCircle, ArrowLeft } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ProductDetail = () => {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [shopSettings, setShopSettings] = useState(null); // <-- NEW: State for settings
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [deliveryStatus, setDeliveryStatus] = useState('idle');
    const [distance, setDistance] = useState(null);

    // Fetch Product AND Shop Settings
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Fetch Product
                const productRes = await fetch(`http://localhost:5000/api/products/${id}`);
                if (!productRes.ok) throw new Error('Product not found');
                const productData = await productRes.json();
                setProduct(productData);

                // 2. Fetch Shop Settings
                const settingsRes = await fetch('http://localhost:5000/api/settings');
                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json();
                    setShopSettings(settingsData);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Could not load product details at this time.");
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Keep coordinates fixed for the math, but the text address will be dynamic
    const SHOP_LAT = 25.98;
    const SHOP_LON = 85.33;
    const MAX_DELIVERY_RADIUS_KM = 5;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const checkDeliveryLocation = () => {
        setDeliveryStatus('checking');

        if (!navigator.geolocation) {
            setDeliveryStatus('error');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLon = position.coords.longitude;
                const dist = calculateDistance(userLat, userLon, SHOP_LAT, SHOP_LON);
                setDistance(dist.toFixed(1));

                if (dist <= MAX_DELIVERY_RADIUS_KM) {
                    setDeliveryStatus('success');
                } else {
                    setDeliveryStatus('out-of-range');
                }
            },
            (error) => {
                console.error("Location error:", error);
                setDeliveryStatus('error');
            },
            { enableHighAccuracy: true }
        );
    };

    const handleWishlist = () => {
        if (!product) return;

        let currentWishlist = JSON.parse(localStorage.getItem('krishna_wishlist')) || [];
        const exists = currentWishlist.find(item => item.id === product._id);

        if (!exists) {
            const savedProduct = {
                id: product._id,
                title: product.title,
                image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/600',
                price: product.price,
                originalPrice: product.originalPrice,
                discount: product.discount,
                rating: product.rating || 4.5
            };

            currentWishlist.push(savedProduct);
            localStorage.setItem('krishna_wishlist', JSON.stringify(currentWishlist));
            alert(`${product.title} added to Wishlist!`);
        } else {
            alert(`${product.title} is already in your Wishlist!`);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-brandBlue min-h-[50vh]">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="font-medium text-gray-600 text-lg">Loading product details...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-500 min-h-[50vh]">
                <AlertCircle size={48} className="mb-4" />
                <p className="font-medium text-lg mb-6">{error || "Product not found"}</p>
                <Link to="/" className="bg-brandBlue text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
            </div>
        );
    }

    // --- USE DYNAMIC SHOP DATA ---
    // Grab the first owner's phone number. If none exists, fallback to dummy data.
    const shopPhone = shopSettings?.owners?.[0]?.phone || "919876543210";
    const displayAddress = shopSettings?.address || "X8MM+3VW, Kurhani, Bihar 844120";

    const whatsappMessage = encodeURIComponent(`Hi, I'm interested in purchasing: ${product.title} (Serial No: ${product.serialNo})`);
    const currentHour = new Date().getHours();
    const isContactable = currentHour >= 8 && currentHour < 20;

    return (
        <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-gray-100 my-6 flex flex-col md:flex-row gap-8">

            <div className="w-full md:w-5/12">
                <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-sm">
                    {product.images && product.images.length > 0 ? (
                        <Swiper pagination={{ clickable: true }} navigation={true} modules={[Pagination, Navigation]} className="w-full h-[400px] md:h-[500px]">
                            {product.images.map((img, index) => (
                                <SwiperSlide key={index}>
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    ) : (
                        <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center text-gray-400">
                            <p>No images available</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full md:w-7/12 flex flex-col">
                <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">{product.title}</h1>
                <p className="text-sm text-gray-500 mb-4">Serial No: <span className="font-bold text-gray-800">{product.serialNo}</span></p>

                <div className="flex items-center gap-1 bg-green-100 text-green-800 text-sm font-bold px-2.5 py-1 rounded-md w-max mb-4 border border-green-200">
                    {product.rating || 4.5} ★
                </div>

                <div className="flex items-end gap-3 mb-6 pb-6 border-b border-gray-100">
                    <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                    <span className="text-lg text-gray-400 line-through mb-1">₹{product.originalPrice}</span>
                    <span className="text-lg text-green-600 font-semibold mb-1">{product.discount}% off</span>
                </div>

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

                {product.inventory && product.inventory.length > 0 && (
                    <div className="mb-6">
                        <h3 className="font-semibold text-gray-800 mb-3">Available Sizes & Quantity</h3>
                        <div className="flex flex-wrap gap-3">
                            {product.inventory.map((item) => (
                                <div key={item.size} className="flex flex-col border border-gray-200 rounded-md overflow-hidden min-w-[80px] shadow-sm">
                                    <div className="bg-gray-100 text-center py-1.5 font-bold text-gray-800 border-b border-gray-200">{item.size}</div>
                                    <div className={`text-center py-1 text-xs font-semibold ${item.quantity > 0 ? 'bg-white text-green-700' : 'bg-red-50 text-red-600'}`}>
                                        {item.quantity > 0 ? `${item.quantity} Left` : 'Sold Out'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <h3 className="font-semibold text-gray-800 mb-2">Product Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{product.description}</p>
                </div>

                <button
                    onClick={handleWishlist}
                    className="w-full mb-4 bg-red-50 border border-red-200 text-red-500 py-3.5 rounded-lg font-medium text-base flex items-center justify-center gap-2 hover:bg-red-100 transition-colors shadow-sm cursor-pointer"
                >
                    <Heart size={20} /> Add to Wishlist
                </button>

                <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                    {isContactable ? (
                        <>
                            <a href={`https://wa.me/${shopPhone}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex-1 bg-[#25D366] text-white py-3.5 rounded-lg font-medium text-base flex items-center justify-center gap-2 hover:bg-[#128C7E] transition-all shadow-sm cursor-pointer hover:shadow-md">
                                <MessageCircle size={20} /> Chat on WhatsApp
                            </a>
                            <a href={`tel:+${shopPhone}`} className="flex-1 bg-brandBlue text-white py-3.5 rounded-lg font-medium text-base flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-sm cursor-pointer hover:shadow-md">
                                <Phone size={20} /> Call Now
                            </a>
                        </>
                    ) : (
                        <div className="w-full bg-gray-50 border border-gray-200 text-gray-500 py-3.5 rounded-lg font-medium text-base flex flex-col items-center justify-center cursor-not-allowed shadow-inner">
                            <span className="flex items-center gap-2 text-gray-700"><Clock size={18} /> Currently Closed</span>
                            <span className="text-xs mt-1 font-normal text-gray-500">Contact options are available between 8:00 AM and 8:00 PM</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <MapPin size={20} className="text-brandBlue" /> Shop Location
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        <strong>Krishna Jewelry and Readymade</strong><br />
                        {displayAddress}
                    </p>
                    <div className="w-full h-48 bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3590.871026049444!2d85.3402777!3d25.8407481!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ed670014023249%3A0x6b677a8cb4cc7b5!2sKurhani%2C%20Bihar%20844120!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Shop Location Map"></iframe>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductDetail;