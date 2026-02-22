import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Store, Loader2, ArrowLeft, ShieldCheck } from 'lucide-react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // In a real production app, we would save a secure token here.
                // For our MVP, we just navigate directly to the dashboard!
                navigate('/admin/dashboard');
            } else {
                setError(data.message || 'Invalid credentials');
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError('Could not connect to the server. Is your backend running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] py-12 px-4 sm:px-6 lg:px-8 bg-gray-50/50 rounded-sm">

            {/* Decorative elevated card */}
            <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">

                {/* Card Header */}
                <div className="bg-brandBlue px-6 py-8 text-center relative overflow-hidden">
                    {/* Subtle background pattern/shape */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-white opacity-10 rounded-full blur-lg"></div>

                    <div className="relative z-10 flex justify-center mb-3">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm shadow-inner">
                            <ShieldCheck size={36} className="text-white" />
                        </div>
                    </div>
                    <h2 className="relative z-10 text-2xl font-bold text-white tracking-wide">
                        Admin Portal
                    </h2>
                    <p className="relative z-10 text-blue-100 text-sm mt-1">
                        Secure access to your store dashboard
                    </p>
                </div>

                {/* Card Body (Form) */}
                <div className="px-8 py-8">

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-sm flex items-start gap-2 animate-pulse">
                            <span className="block">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Admin Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-brandBlue focus:border-brandBlue text-sm transition-colors"
                                    placeholder="admin@krishna.com"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-brandBlue focus:border-brandBlue text-sm transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-md shadow-md text-sm font-medium text-white transition-all cursor-pointer ${loading ? 'bg-blue-400' : 'bg-brandBlue hover:bg-blue-700 hover:shadow-lg'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" /> Authenticating...
                                </>
                            ) : (
                                'Sign In to Dashboard'
                            )}
                        </button>
                    </form>
                </div>

                {/* Card Footer */}
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 flex justify-center">
                    <Link to="/" className="text-sm font-medium text-gray-500 hover:text-brandBlue flex items-center gap-1 transition-colors">
                        <ArrowLeft size={16} /> Back to Storefront
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default AdminLogin;