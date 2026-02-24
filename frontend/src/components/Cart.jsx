import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Phone, ShieldCheck } from 'lucide-react';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [shopPhone, setShopPhone] = useState("919876543210"); // Fallback
    const navigate = useNavigate();

    // Load cart items and shop settings on mount
    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('krishna_cart')) || [];
        setCartItems(savedCart);

        const fetchShopPhone = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    if (data.owners && data.owners.length > 0) {
                        setShopPhone(data.owners[0].phone);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch shop settings");
            }
        };
        fetchShopPhone();
    }, []);

    const updateQuantity = (id, size, change) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === id && item.selectedSize === size) {
                const newQty = item.quantity + change;
                const maxLimit = item.maxQuantity || 99; // Fallback limit

                // Prevent user from adding more than we have in stock
                if (newQty > maxLimit) {
                    alert(`Sorry, we only have ${maxLimit} in stock for this size.`);
                    return item; // Keep the quantity exactly as it was
                }

                return { ...item, quantity: newQty > 0 ? newQty : 1 };
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem('krishna_cart', JSON.stringify(updatedCart));
    };

    const removeItem = (id, size) => {
        const updatedCart = cartItems.filter(item => !(item.id === id && item.selectedSize === size));
        setCartItems(updatedCart);
        localStorage.setItem('krishna_cart', JSON.stringify(updatedCart));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleCheckout = () => {
        const currentUser = JSON.parse(localStorage.getItem('krishna_user'));

        if (!currentUser) {
            alert("Please login to place your order!");
            navigate('/login');
            return;
        }

        // Format the WhatsApp Order Message
        let message = `*NEW ORDER FROM KRISHNA JEWELRY*\n\n`;
        message += `*Customer Details:*\nName: ${currentUser.name}\nPhone: ${currentUser.phone}\n\n`;
        message += `*Order Items:*\n`;

        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (Size: ${item.selectedSize})\n   Qty: ${item.quantity} x ₹${item.price} = ₹${item.quantity * item.price}\n`;
            message += `   Serial: ${item.serialNo}\n\n`;
        });

        message += `*Total Amount: ₹${calculateTotal()}*\n\n`;
        message += `Please confirm my order and let me know about delivery/pickup!`;

        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${shopPhone}?text=${encodedMessage}`, '_blank');
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
                <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center max-w-lg w-full text-center">
                    <div className="bg-blue-50 p-6 rounded-full mb-6">
                        <ShoppingBag size={64} className="text-brandBlue opacity-80" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="bg-brandBlue text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                        Start Shopping <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                <ShoppingBag className="text-brandBlue" /> Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Cart Items List */}
                <div className="w-full lg:w-2/3 flex flex-col gap-4">
                    {cartItems.map((item, index) => (
                        <div key={`${item.id}-${item.selectedSize}-${index}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-4 relative transition-all hover:shadow-md">
                            <img src={item.image} alt={item.title} className="w-24 h-24 object-cover rounded-lg border border-gray-100" />

                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="font-semibold text-gray-800 text-lg">{item.title}</h3>
                                <p className="text-sm text-gray-500">Size: <span className="font-bold text-gray-700">{item.selectedSize}</span> | ID: {item.serialNo}</p>
                                <div className="mt-2 font-bold text-brandBlue text-xl">₹{item.price}</div>
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
                                <button onClick={() => updateQuantity(item.id, item.selectedSize, -1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brandBlue cursor-pointer">
                                    <Minus size={16} />
                                </button>
                                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brandBlue cursor-pointer">
                                    <Plus size={16} />
                                </button>
                            </div>

                            <button onClick={() => removeItem(item.id, item.selectedSize)} className="sm:absolute sm:top-4 sm:right-4 text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors cursor-pointer mt-2 sm:mt-0" title="Remove Item">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Order Summary Sidebar */}
                <div className="w-full lg:w-1/3">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                        <div className="flex flex-col gap-3 text-gray-600 mb-6">
                            <div className="flex justify-between">
                                <span>Items ({cartItems.length})</span>
                                <span className="font-medium text-gray-800">₹{calculateTotal()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span className="text-green-600 font-medium">Calculated at checkout</span>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4 mb-6 flex justify-between items-end">
                            <span className="text-gray-800 font-bold">Total Amount</span>
                            <span className="text-2xl font-bold text-brandBlue">₹{calculateTotal()}</span>
                        </div>

                        <button onClick={handleCheckout} className="w-full bg-brandBlue text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-md cursor-pointer hover:shadow-lg">
                            Proceed to Checkout
                        </button>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 text-center">
                            <ShieldCheck size={16} className="text-green-600" />
                            Secure Checkout via WhatsApp
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Cart;