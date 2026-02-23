import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); // 1 = Form, 2 = OTP Verification
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', otp: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Animation state for smooth form transitions
    const [isAnimating, setIsAnimating] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // Handle Tab Switching with a slight delay for the fade effect
    const handleTabSwitch = (loginState) => {
        if (isLogin === loginState) return;
        setIsAnimating(true);
        setMessage('');
        setTimeout(() => {
            setIsLogin(loginState);
            setIsAnimating(false);
        }, 200);
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (res.ok) {
                if (isLogin) {
                    localStorage.setItem('krishna_user', JSON.stringify(data.user));
                    navigate(-1);
                } else {
                    setStep(2);
                    setMessage('OTP sent to your email! Please verify to continue.');
                }
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage('Server error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('http://localhost:5000/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: formData.otp })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('krishna_user', JSON.stringify(data.user));
                navigate(-1);
            } else {
                setMessage(data.message);
            }
        } catch (err) {
            setMessage('Verification failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-blue-100">

            {/* Floating Glass Card */}
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white max-w-md w-full overflow-hidden transform transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">

                {/* Step 1: Login or Sign Up Tabs */}
                {step === 1 && (
                    <>
                        {/* Animated Tab Menu */}
                        <div className="relative flex border-b border-gray-100">
                            {/* Sliding Blue Indicator */}
                            <div
                                className={`absolute bottom-0 h-1 bg-brandBlue transition-all duration-300 ease-out rounded-t-md ${isLogin ? 'left-0 w-1/2' : 'left-1/2 w-1/2'}`}
                            ></div>

                            <button
                                type="button"
                                onClick={() => handleTabSwitch(true)}
                                className={`flex-1 py-4 text-center font-semibold text-lg transition-colors cursor-pointer z-10 ${isLogin ? 'text-brandBlue' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTabSwitch(false)}
                                className={`flex-1 py-4 text-center font-semibold text-lg transition-colors cursor-pointer z-10 ${!isLogin ? 'text-brandBlue' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        <div className={`p-8 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-sm text-gray-500 text-center mb-8">
                                {isLogin ? 'Enter your details to access your account.' : 'Join us to place orders and track history.'}
                            </p>

                            {message && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100 animate-pulse">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="flex flex-col gap-5">

                                {/* Sign Up Fields (Fades in if !isLogin) */}
                                {!isLogin && (
                                    <div className="flex flex-col gap-5 animate-[fadeIn_0.5s_ease-in-out]">
                                        <div className="group relative">
                                            <User size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brandBlue transition-colors" />
                                            <input type="text" name="name" required placeholder="Full Name" onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all text-sm bg-gray-50 focus:bg-white" />
                                        </div>
                                        <div className="group relative">
                                            <Phone size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brandBlue transition-colors" />
                                            <input type="text" name="phone" required placeholder="Phone Number" onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all text-sm bg-gray-50 focus:bg-white" />
                                        </div>
                                    </div>
                                )}

                                {/* Always visible fields */}
                                <div className="group relative">
                                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brandBlue transition-colors" />
                                    <input type="email" name="email" required placeholder="Email Address" onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all text-sm bg-gray-50 focus:bg-white" />
                                </div>

                                <div className="group relative">
                                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brandBlue transition-colors" />
                                    <input type="password" name="password" required placeholder="Password" onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all text-sm bg-gray-50 focus:bg-white" />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full text-white py-3.5 rounded-xl font-semibold mt-2 transition-all duration-200 flex justify-center items-center gap-2 shadow-md cursor-pointer
                    ${loading ? 'bg-blue-400 scale-95' : 'bg-brandBlue hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95'}`}
                                >
                                    {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : isLogin ? 'Secure Login' : 'Create Account & Verify'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {/* Step 2: OTP Verification Screen */}
                {step === 2 && (
                    <div className="p-8 animate-[fadeIn_0.5s_ease-in-out]">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-50 p-4 rounded-full relative">
                                <div className="absolute inset-0 bg-brandBlue opacity-20 rounded-full animate-ping"></div>
                                <ShieldCheck size={36} className="text-brandBlue relative z-10" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 tracking-tight">Verify Your Email</h2>
                        <p className="text-sm text-gray-500 text-center mb-8">
                            We sent a 6-digit code to <br /><span className="font-semibold text-gray-800">{formData.email}</span>
                        </p>

                        {message && (
                            <div className={`mb-6 p-3 text-sm font-medium rounded-lg text-center border ${message.includes('failed') || message.includes('error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="flex flex-col gap-6">
                            <div className="group relative">
                                <input
                                    type="text"
                                    name="otp"
                                    required
                                    placeholder="------"
                                    onChange={handleChange}
                                    maxLength={6}
                                    className="w-full text-center tracking-[0.75em] font-bold text-3xl py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brandBlue focus:border-brandBlue outline-none transition-all bg-gray-50 focus:bg-white"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-200 flex justify-center items-center gap-2 shadow-md cursor-pointer
                  ${loading ? 'bg-green-400 scale-95' : 'bg-green-600 hover:bg-green-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95'}`}
                            >
                                {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Verify & Login'}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="mt-2 text-sm font-medium text-gray-500 hover:text-brandBlue flex items-center justify-center gap-1 transition-colors cursor-pointer hover:underline"
                            >
                                <ArrowLeft size={16} /> Back to Sign Up
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Login;