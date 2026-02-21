import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        // Temporary frontend check. Later, this will check against your Node.js database!
        if (email === 'admin@krishna.com' && password === 'admin123') {
            navigate('/admin/dashboard');
        } else {
            alert('Invalid admin credentials!');
        }
    };

    return (
        <div className="flex justify-center items-center my-20">
            <div className="bg-white p-8 rounded-sm shadow-md w-full max-w-md border border-gray-200">
                <div className="flex flex-col items-center mb-6">
                    <div className="bg-brandBlue p-3 rounded-full text-white mb-3">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Admin Secure Login</h2>
                    <p className="text-sm text-gray-500">Krishna Jewelry and Readymade</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue"
                            placeholder="admin@krishna.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-brandBlue"
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" className="w-full bg-brandBlue text-white py-2 rounded-sm font-medium mt-2 hover:bg-blue-700 transition-colors cursor-pointer">
                        Login to Dashboard
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;