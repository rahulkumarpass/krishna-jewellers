import React, { useState } from 'react';
import { Upload, Plus, Store, Settings, Loader2, CheckCircle2 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    // Form States
    const [title, setTitle] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [category, setCategory] = useState("Men's Wear");
    const [description, setDescription] = useState('');

    // Inventory State (Tracking quantities for S, M, L, XL)
    const [inventory, setInventory] = useState({ S: 0, M: 0, L: 0, XL: 0 });

    // Image Upload State
    const [images, setImages] = useState([]);

    // UI States
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Handle inventory input changes
    const handleInventoryChange = (size, value) => {
        setInventory(prev => ({ ...prev, [size]: value }));
    };

    // Handle image selection (Limit to 6)
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 6) {
            alert("You can only upload up to 6 images per product.");
            return;
        }
        setImages(files);
    };

    // Handle Form Submission to Backend
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (images.length === 0) {
            alert("Please upload at least one image.");
            setLoading(false);
            return;
        }

        // 1. Create FormData because we are sending Files (images) + Text
        const formData = new FormData();
        formData.append('title', title);
        formData.append('serialNo', serialNo);
        formData.append('price', price);
        formData.append('originalPrice', originalPrice);
        formData.append('category', category);
        formData.append('description', description);

        // 2. Format the inventory to match the backend schema expectation
        const inventoryArray = [
            { size: 'S', quantity: Number(inventory.S) },
            { size: 'M', quantity: Number(inventory.M) },
            { size: 'L', quantity: Number(inventory.L) },
            { size: 'XL', quantity: Number(inventory.XL) }
        ];
        formData.append('inventory', JSON.stringify(inventoryArray));

        // 3. Append each image file to the form data
        images.forEach(image => {
            formData.append('images', image);
        });

        try {
            // 4. Send the POST request to your Node.js backend
            const response = await fetch('http://localhost:5000/api/products', {
                method: 'POST',
                body: formData, // Notice we don't set headers; browser sets multipart/form-data automatically
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Product successfully published to the store!');
                // Clear form
                setTitle(''); setSerialNo(''); setPrice(''); setOriginalPrice('');
                setDescription(''); setInventory({ S: 0, M: 0, L: 0, XL: 0 }); setImages([]);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Upload error:", error);
            setMessage("Failed to connect to the server. Is your backend running?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="my-8 flex flex-col md:flex-row gap-6">

            {/* Sidebar Menu */}
            <div className="w-full md:w-1/4 bg-white p-4 rounded-sm shadow-sm border border-gray-200 h-max">
                <h2 className="text-xl font-bold text-gray-800 mb-6 px-2">Admin Panel</h2>
                <ul className="flex flex-col gap-2">
                    <li>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-colors cursor-pointer ${activeTab === 'products' ? 'bg-blue-50 text-brandBlue font-medium border-l-4 border-brandBlue' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Plus size={20} /> Add New Product
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-colors cursor-pointer ${activeTab === 'settings' ? 'bg-blue-50 text-brandBlue font-medium border-l-4 border-brandBlue' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Settings size={20} /> Shop Settings
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-3/4 bg-white p-6 md:p-8 rounded-sm shadow-sm border border-gray-200">

                {activeTab === 'products' && (
                    <div>
                        <h3 className="text-2xl font-medium text-gray-800 mb-6 border-b pb-2">Upload New Product</h3>

                        {message && (
                            <div className={`mb-6 p-4 rounded-sm flex items-center gap-2 ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                {message.includes('Error') ? null : <CheckCircle2 size={20} />}
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue" placeholder="e.g. Premium Checked Shirt" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                                    <input type="text" required value={serialNo} onChange={(e) => setSerialNo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue" placeholder="e.g. KJ-CL-001" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                                    <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue" placeholder="499" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                                    <input type="number" required value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue" placeholder="999" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue">
                                        <option>Men's Wear</option>
                                        <option>Women's Wear</option>
                                        <option>Kids Wear</option>
                                        <option>Accessories</option>
                                    </select>
                                </div>
                            </div>

                            {/* Inventory Input */}
                            <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Inventory Quantities (By Size)</label>
                                <div className="flex gap-4">
                                    {['S', 'M', 'L', 'XL'].map(size => (
                                        <div key={size} className="flex-1">
                                            <span className="block text-xs font-bold text-gray-500 mb-1">{size}</span>
                                            <input
                                                type="number"
                                                min="0"
                                                value={inventory[size]}
                                                onChange={(e) => handleInventoryChange(size, e.target.value)}
                                                className="w-full px-2 py-1 border border-gray-300 rounded-sm text-sm"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Multi-Image Upload (Up to 6) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Images (Up to 6)</label>
                                <div className="relative border-2 border-dashed border-brandBlue bg-blue-50 p-8 rounded-sm flex flex-col items-center justify-center hover:bg-blue-100 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/png, image/jpeg, image/jpg"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload size={32} className="text-brandBlue mb-2" />
                                    <span className="text-brandBlue font-medium">Click or drag images here</span>
                                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</span>
                                </div>
                                {images.length > 0 && (
                                    <p className="text-sm text-green-600 mt-2 font-medium">{images.length} file(s) selected for upload.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue"
                                    placeholder="Write the full product details here..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full md:w-auto self-end text-white py-2 px-8 rounded-sm font-medium mt-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${loading ? 'bg-blue-400' : 'bg-brandBlue hover:bg-blue-700'}`}
                            >
                                {loading ? <><Loader2 size={18} className="animate-spin" /> Publishing...</> : 'Save & Publish Product'}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div>
                        <h3 className="text-2xl font-medium text-gray-800 mb-6 border-b pb-2">Update Shop Details</h3>
                        <p className="text-gray-600">Settings dashboard coming soon.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;