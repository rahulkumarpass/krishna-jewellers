import React, { useState, useEffect } from 'react';
import { Upload, Plus, Settings, Loader2, CheckCircle2, Trash2, PlusCircle, Package, ArrowLeft, Image as ImageIcon, Edit3 } from 'lucide-react';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    // ==========================================
    // PRODUCT LIST STATES
    // ==========================================
    const [existingProducts, setExistingProducts] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [fetchingProducts, setFetchingProducts] = useState(true);

    // ==========================================
    // ADD / EDIT PRODUCT STATES
    // ==========================================
    const [editingProductId, setEditingProductId] = useState(null); // Tracks if we are editing
    const [title, setTitle] = useState('');
    const [serialNo, setSerialNo] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [category, setCategory] = useState("Men's Wear");
    const [description, setDescription] = useState('');
    const [inventory, setInventory] = useState([{ size: '', quantity: 0 }]);
    const [images, setImages] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // ==========================================
    // SHOP SETTINGS STATES 
    // ==========================================
    const [owners, setOwners] = useState([{ name: 'Shop Owner', phone: '919876543210', photo: null }]);
    const [staffList, setStaffList] = useState([{ name: 'Shop Staff', phone: '919876543211', photo: null }]);
    const [address, setAddress] = useState('X8MM+3VW, Kurhani, Bihar 844120');
    const [settingsMessage, setSettingsMessage] = useState('');

    // Fetch existing products
    useEffect(() => {
        if (activeTab === 'products' && !showAddForm) {
            fetchExistingProducts();
        }
    }, [activeTab, showAddForm]);

    const fetchExistingProducts = async () => {
        setFetchingProducts(true);
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();
            setExistingProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setFetchingProducts(false);
        }
    };

    // Fetch Shop Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/settings');
                if (response.ok) {
                    const data = await response.json();
                    // We removed the length check so it perfectly syncs with the database, even if empty!
                    if (data.owners) setOwners(data.owners);
                    if (data.staffList) setStaffList(data.staffList);
                    if (data.address) setAddress(data.address);
                }
            } catch (err) {
                console.error("Failed to fetch settings", err);
            }
        };
        fetchSettings();
    }, []);

    // ==========================================
    // PRODUCT FORM HANDLERS
    // ==========================================

    const resetProductForm = () => {
        setEditingProductId(null);
        setTitle(''); setSerialNo(''); setPrice(''); setOriginalPrice('');
        setCategory("Men's Wear"); setDescription('');
        setInventory([{ size: '', quantity: 0 }]); setImages([]);
        setMessage('');
    };

    const handleEditClick = (product) => {
        setEditingProductId(product._id);
        setTitle(product.title);
        setSerialNo(product.serialNo || '');
        setPrice(product.price);
        setOriginalPrice(product.originalPrice);
        setCategory(product.category);
        setDescription(product.description);
        setInventory(product.inventory && product.inventory.length > 0 ? product.inventory : [{ size: '', quantity: 0 }]);
        setImages([]); // Leave empty so backend keeps old images unless new ones are uploaded
        setShowAddForm(true);
    };

    const handleAddSize = () => setInventory([...inventory, { size: '', quantity: 0 }]);
    const handleRemoveSize = (index) => setInventory(inventory.filter((_, i) => i !== index));
    const handleInventoryChange = (index, field, value) => {
        const newInventory = [...inventory];
        newInventory[index][field] = value;
        setInventory(newInventory);
    };
    const handleImageChange = (e) => setImages(Array.from(e.target.files).slice(0, 6));

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        // 1. UNIQUE ID VALIDATION: Check if another product already has this Serial Number
        const isDuplicate = existingProducts.some(p => p.serialNo === serialNo && p._id !== editingProductId);
        if (isDuplicate) {
            setMessage("Error: This Serial Number is already used by another product!");
            setLoading(false);
            return;
        }

        if (!editingProductId && images.length === 0) {
            alert("Please upload at least one image.");
            setLoading(false);
            return;
        }

        const validInventory = inventory.filter(item => item.size.trim() !== '');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('serialNo', serialNo);
        formData.append('price', price);
        formData.append('originalPrice', originalPrice);
        formData.append('category', category);
        formData.append('description', description);
        formData.append('inventory', JSON.stringify(validInventory));

        // Only append images if the user selected new ones
        if (images.length > 0) {
            images.forEach(image => formData.append('images', image));
        }

        // Determine if we are creating new or updating existing
        const url = editingProductId
            ? `http://localhost:5000/api/products/${editingProductId}`
            : 'http://localhost:5000/api/products';
        const method = editingProductId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, { method, body: formData });
            const data = await response.json();

            if (response.ok) {
                setMessage(editingProductId ? 'Product updated successfully!' : 'Product published successfully!');
                setTimeout(() => {
                    setShowAddForm(false);
                    resetProductForm();
                }, 2000);
            } else {
                setMessage(`Error: ${data.message}`);
            }
        } catch (error) {
            setMessage("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SETTINGS HANDLERS
    // ==========================================

    const handlePersonChange = (type, index, field, value) => {
        const updated = type === 'owner' ? [...owners] : [...staffList];
        updated[index][field] = value;
        type === 'owner' ? setOwners(updated) : setStaffList(updated);
    };

    const addPerson = (type) => {
        type === 'owner' ? setOwners([...owners, { name: '', phone: '', photo: null }]) : setStaffList([...staffList, { name: '', phone: '', photo: null }]);
    };

    const removePerson = (type, index) => {
        type === 'owner' ? setOwners(owners.filter((_, i) => i !== index)) : setStaffList(staffList.filter((_, i) => i !== index));
    };

    const handleSettingsSubmit = async (e) => {
        e.preventDefault();
        setSettingsMessage('Saving details...');

        const formData = new FormData();
        const ownersData = owners.map(o => ({ name: o.name, phone: o.phone, photo: typeof o.photo === 'string' ? o.photo : null }));
        const staffData = staffList.map(s => ({ name: s.name, phone: s.phone, photo: typeof s.photo === 'string' ? s.photo : null }));

        formData.append('owners', JSON.stringify(ownersData));
        formData.append('staffList', JSON.stringify(staffData));
        formData.append('address', address);

        owners.forEach((owner, index) => { if (owner.photo instanceof File) formData.append(`ownerPhoto_${index}`, owner.photo); });
        staffList.forEach((staff, index) => { if (staff.photo instanceof File) formData.append(`staffPhoto_${index}`, staff.photo); });

        try {
            const response = await fetch('http://localhost:5000/api/settings', { method: 'POST', body: formData });
            if (response.ok) {
                const data = await response.json();
                setSettingsMessage('Shop settings saved successfully!');
                setOwners(data.settings.owners);
                setStaffList(data.settings.staffList);
                setTimeout(() => setSettingsMessage(''), 3000);
            } else {
                setSettingsMessage('Failed to save settings.');
            }
        } catch (error) {
            setSettingsMessage('Error saving settings. Check server connection.');
        }
    };

    // ==========================================
    // RENDER UI
    // ==========================================

    return (
        <div className="my-8 flex flex-col md:flex-row gap-6 min-h-[70vh]">

            {/* Sidebar Menu */}
            <div className="w-full md:w-1/4 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-max">
                <div className="bg-brandBlue p-4 rounded-lg mb-6 text-white text-center shadow-inner">
                    <h2 className="text-xl font-bold tracking-wide">Admin Dashboard</h2>
                    <p className="text-xs text-blue-200 mt-1">Manage your store</p>
                </div>

                <ul className="flex flex-col gap-2">
                    <li>
                        <button
                            onClick={() => { setActiveTab('products'); setShowAddForm(false); resetProductForm(); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${activeTab === 'products' ? 'bg-blue-50 text-brandBlue font-semibold border-l-4 border-brandBlue shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Package size={20} /> Manage Products
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-blue-50 text-brandBlue font-semibold border-l-4 border-brandBlue shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Settings size={20} /> Shop Settings
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-3/4 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">

                {/* ========================================== */}
                {/* TAB 1: MANAGE PRODUCTS (LIST OR FORM) */}
                {/* ========================================== */}
                {activeTab === 'products' && (
                    <div>
                        {!showAddForm ? (
                            // --- PRODUCT LIST VIEW ---
                            <div className="animate-fadeIn">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-100 pb-4 gap-4">
                                    <h3 className="text-2xl font-semibold text-gray-800">Inventory Overview</h3>
                                    <button
                                        onClick={() => { resetProductForm(); setShowAddForm(true); }}
                                        className="bg-brandBlue text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                                    >
                                        <Plus size={18} /> Add New Product
                                    </button>
                                </div>

                                {fetchingProducts ? (
                                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brandBlue" size={32} /></div>
                                ) : existingProducts.length === 0 ? (
                                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        <Package size={48} className="mx-auto text-gray-300 mb-3" />
                                        <p className="text-gray-500 font-medium">No products found.</p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200">
                                        <table className="w-full text-left text-sm text-gray-600">
                                            <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-semibold">Product</th>
                                                    <th className="px-4 py-3 font-semibold">Category</th>
                                                    <th className="px-4 py-3 font-semibold">Price</th>
                                                    <th className="px-4 py-3 font-semibold">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {existingProducts.map(prod => {
                                                    const totalStock = prod.inventory.reduce((sum, item) => sum + item.quantity, 0);
                                                    return (
                                                        <tr key={prod._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                            <td className="px-4 py-3 font-medium text-gray-800 flex items-center gap-3">
                                                                {prod.images && prod.images[0] ? (
                                                                    <img src={prod.images[0]} alt="thumb" className="w-10 h-10 rounded object-cover border border-gray-200" />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center border border-gray-300">
                                                                        <ImageIcon size={16} className="text-gray-400" />
                                                                    </div>
                                                                )}
                                                                <div>
                                                                    <p>{prod.title}</p>
                                                                    <p className="text-xs text-gray-400 font-normal">ID: {prod.serialNo}</p>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">{prod.category}</td>
                                                            <td className="px-4 py-3 font-medium text-green-600">₹{prod.price}</td>
                                                            <td className="px-4 py-3">
                                                                <button
                                                                    onClick={() => handleEditClick(prod)}
                                                                    className="flex items-center gap-1 text-brandBlue hover:text-blue-700 font-medium px-3 py-1.5 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                                                >
                                                                    <Edit3 size={16} /> Edit
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // --- ADD / EDIT PRODUCT FORM VIEW ---
                            <div className="animate-fadeIn">
                                <div className="flex items-center gap-4 border-b border-gray-100 pb-4 mb-6">
                                    <button onClick={() => { setShowAddForm(false); resetProductForm(); }} className="text-gray-400 hover:text-brandBlue transition-colors cursor-pointer" title="Back to Product List">
                                        <ArrowLeft size={24} />
                                    </button>
                                    <h3 className="text-2xl font-semibold text-gray-800">
                                        {editingProductId ? 'Edit Product Details' : 'Upload New Product'}
                                    </h3>
                                </div>

                                {message && (
                                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${message.includes('Error') || message.includes('Failed') ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                                        {message.includes('Error') ? null : <CheckCircle2 size={20} />}
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleProductSubmit} className="flex flex-col gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                                            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number (Must be unique)</label>
                                            <input type="text" required value={serialNo} onChange={(e) => setSerialNo(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue transition-all" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price (₹)</label>
                                            <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
                                            <input type="number" required value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue transition-all" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue transition-all">
                                                <option>Men's Wear</option>
                                                <option>Women's Wear</option>
                                                <option>Kids Wear</option>
                                                <option>Accessories</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-bold text-gray-800">Inventory & Sizes</label>
                                            <button type="button" onClick={handleAddSize} className="text-brandBlue text-sm font-medium flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                                                <PlusCircle size={16} /> Add Size Variant
                                            </button>
                                        </div>

                                        <div className="flex flex-col gap-3">
                                            {inventory.map((item, index) => (
                                                <div key={index} className="flex items-center gap-4 bg-white p-2 rounded-lg border border-gray-200">
                                                    <div className="flex-1">
                                                        <input type="text" placeholder="Size (e.g. 32 or XL)" value={item.size} onChange={(e) => handleInventoryChange(index, 'size', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none" required />
                                                    </div>
                                                    <div className="flex-1">
                                                        <input type="number" min="0" placeholder="Quantity" value={item.quantity} onChange={(e) => handleInventoryChange(index, 'quantity', e.target.value)} className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm outline-none" required />
                                                    </div>
                                                    <button type="button" onClick={() => handleRemoveSize(index)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Images (Up to 6)</label>
                                        <div className="relative border-2 border-dashed border-brandBlue bg-blue-50/50 p-8 rounded-xl flex flex-col items-center justify-center hover:bg-blue-50 transition-colors">
                                            <input type="file" multiple accept="image/png, image/jpeg, image/jpg" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                            <Upload size={28} className="text-brandBlue mb-2" />
                                            <span className="text-brandBlue font-semibold text-sm">Click to select new images</span>
                                            {editingProductId && <span className="text-xs text-gray-500 mt-1">Leave empty to keep existing product images</span>}
                                        </div>
                                        {images.length > 0 && <p className="text-sm text-green-600 mt-2 font-medium">{images.length} file(s) selected to overwrite old images.</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Description</label>
                                        <textarea rows="4" required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue transition-all"></textarea>
                                    </div>

                                    <button type="submit" disabled={loading} className={`w-full md:w-auto self-end text-white py-2.5 px-8 rounded-lg font-medium mt-2 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${loading ? 'bg-blue-400' : 'bg-brandBlue hover:bg-blue-700 hover:shadow-lg'}`}>
                                        {loading ? <><Loader2 size={18} className="animate-spin" /> {editingProductId ? 'Updating...' : 'Publishing...'}</> : (editingProductId ? 'Update Product' : 'Save & Publish Product')}
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                )}

                {/* ========================================== */}
                {/* TAB 2: SHOP SETTINGS (WITH PHOTO UPLOAD) */}
                {/* ========================================== */}
                {activeTab === 'settings' && (
                    <div className="animate-fadeIn">
                        <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-4">Update Shop Details</h3>

                        {settingsMessage && (
                            <div className={`mb-6 p-4 rounded-lg flex items-center gap-2 transition-all font-medium text-sm ${settingsMessage.includes('Error') || settingsMessage.includes('Failed') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-800 border border-green-200'}`}>
                                {settingsMessage.includes('Error') || settingsMessage.includes('Failed') ? <Settings size={20} /> : <CheckCircle2 size={20} />}
                                {settingsMessage}
                            </div>
                        )}

                        <form onSubmit={handleSettingsSubmit} className="flex flex-col gap-8">

                            {/* OWNERS SECTION */}
                            <div className="bg-gray-50 p-5 border border-gray-200 rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800">Shop Owners</h4>
                                    <button type="button" onClick={() => addPerson('owner')} className="text-brandBlue text-sm font-medium flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                                        <PlusCircle size={16} /> Add Owner
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {owners.map((owner, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row items-start gap-4 bg-white p-4 border border-gray-100 rounded-lg shadow-sm">
                                            <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden group cursor-pointer hover:border-brandBlue transition-colors" title="Upload Photo">
                                                <input type="file" accept="image/*" onChange={(e) => handlePersonChange('owner', index, 'photo', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                                                {owner.photo ? (
                                                    <img src={typeof owner.photo === 'string' ? owner.photo : URL.createObjectURL(owner.photo)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-gray-400 group-hover:text-brandBlue" />
                                                )}
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Owner Name</label>
                                                    <input type="text" required value={owner.name} onChange={(e) => handlePersonChange('owner', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-brandBlue outline-none text-sm" placeholder="Name" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                                    <input type="text" required value={owner.phone} onChange={(e) => handlePersonChange('owner', index, 'phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-brandBlue outline-none text-sm" placeholder="e.g. 919876543210" />
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removePerson('owner', index)} className="mt-5 sm:mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Remove Owner">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* STAFF SECTION */}
                            <div className="bg-gray-50 p-5 border border-gray-200 rounded-xl shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-gray-800">Staff Members</h4>
                                    <button type="button" onClick={() => addPerson('staff')} className="text-brandBlue text-sm font-medium flex items-center gap-1 hover:text-blue-700 cursor-pointer">
                                        <PlusCircle size={16} /> Add Staff
                                    </button>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {staffList.map((staff, index) => (
                                        <div key={index} className="flex flex-col sm:flex-row items-start gap-4 bg-white p-4 border border-gray-100 rounded-lg shadow-sm">
                                            <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden group cursor-pointer hover:border-brandBlue transition-colors" title="Upload Photo">
                                                <input type="file" accept="image/*" onChange={(e) => handlePersonChange('staff', index, 'photo', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer" />
                                                {staff.photo ? (
                                                    <img src={typeof staff.photo === 'string' ? staff.photo : URL.createObjectURL(staff.photo)} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={24} className="text-gray-400 group-hover:text-brandBlue" />
                                                )}
                                            </div>

                                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Staff Name</label>
                                                    <input type="text" required value={staff.name} onChange={(e) => handlePersonChange('staff', index, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-brandBlue outline-none text-sm" placeholder="Name" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                                    <input type="text" required value={staff.phone} onChange={(e) => handlePersonChange('staff', index, 'phone', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-brandBlue outline-none text-sm" placeholder="e.g. 919876543211" />
                                                </div>
                                            </div>
                                            <button type="button" onClick={() => removePerson('staff', index)} className="mt-5 sm:mt-6 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Remove Staff">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {staffList.length === 0 && <p className="text-sm text-gray-500 italic">No staff added yet.</p>}
                                </div>
                            </div>

                            {/* ADDRESS SECTION */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Address</label>
                                <textarea rows="3" required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all shadow-sm"></textarea>
                            </div>

                            <button type="submit" className="w-full md:w-auto self-end bg-brandBlue text-white py-3 px-8 rounded-lg font-medium mt-2 hover:bg-blue-700 transition-colors cursor-pointer shadow-md hover:shadow-lg">
                                Save Settings
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;