import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Loader2, ShieldCheck, ArrowLeft, RefreshCw } from 'lucide-react';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1); // 1 = Form, 2 = OTP Verification
    const [formData, setFormData] = useState({ name: '', phone: '', email: '', password: '', otp: '' });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isAnimating, setIsAnimating] = useState(false);

    // === NEW CAPTCHA STATES ===
    const [captchaText, setCaptchaText] = useState('');
    const [captchaInput, setCaptchaInput] = useState('');

    const navigate = useNavigate();

    // === GENERATE RANDOM CAPTCHA ===
    const generateCaptcha = () => {
        // Removed confusing characters like 0, O, 1, I, L
        const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaText(captcha);
        setCaptchaInput(''); // Clear input when a new one is generated
    };

    // Generate a new captcha when the page loads OR when switching tabs
    useEffect(() => {
        generateCaptcha();
    }, [isLogin]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

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

        // === NEW: VALIDATE CAPTCHA BEFORE DOING ANYTHING ===
        if (captchaInput !== captchaText) {
            setMessage('Invalid Captcha. Please try again.');
            generateCaptcha(); // Force them to try a new one
            return;
        }

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
                generateCaptcha(); // Regenerate captcha on failed login
            }
        } catch (err) {
            setMessage('Server error. Please check your connection.');
            generateCaptcha();
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
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white max-w-md w-full overflow-hidden transform transition-all duration-300">

                {step === 1 && (
                    <>
                        <div className="relative flex border-b border-gray-100">
                            <div className={`absolute bottom-0 h-1 bg-brandBlue transition-all duration-300 ease-out rounded-t-md ${isLogin ? 'left-0 w-1/2' : 'left-1/2 w-1/2'}`}></div>
                            <button type="button" onClick={() => handleTabSwitch(true)} className={`flex-1 py-4 text-center font-semibold text-lg transition-colors cursor-pointer z-10 ${isLogin ? 'text-brandBlue' : 'text-gray-400 hover:text-gray-600'}`}>Login</button>
                            <button type="button" onClick={() => handleTabSwitch(false)} className={`flex-1 py-4 text-center font-semibold text-lg transition-colors cursor-pointer z-10 ${!isLogin ? 'text-brandBlue' : 'text-gray-400 hover:text-gray-600'}`}>Sign Up</button>
                        </div>

                        <div className={`p-8 transition-opacity duration-200 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                            <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 tracking-tight">
                                {isLogin ? 'Welcome Back' : 'Create Account'}
                            </h2>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                {isLogin ? 'Enter your details to access your account.' : 'Join us to place orders and track history.'}
                            </p>

                            {message && (
                                <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-lg text-center border border-red-100">
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleAuth} className="flex flex-col gap-4">

                                {!isLogin && (
                                    <div className="flex flex-col gap-4 animate-[fadeIn_0.5s_ease-in-out]">
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

                                <div className="group relative">
                                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brandBlue transition-colors" />
                                    <input type="email" name="email" required placeholder="Email Address" onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all text-sm bg-gray-50 focus:bg-white" />
                                </div>

                                <div className="group relative mb-2">
                                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-brandBlue transition-colors" />
                                    <input type="password" name="password" required placeholder="Password" onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-brandBlue outline-none transition-all text-sm bg-gray-50 focus:bg-white" />
                                </div>

                                {/* === CUSTOM CAPTCHA UI === */}
                                <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <label className="block text-xs font-semibold text-gray-600">Security Check</label>
                                    <div className="flex gap-3 items-center">

                                        {/* The Captcha Image Simulation */}
                                        <div className="flex-1 bg-gradient-to-r from-gray-200 to-gray-300 relative overflow-hidden rounded-lg h-12 flex items-center justify-center select-none shadow-inner border border-gray-300">
                                            {/* Random styling to make it look like a Captcha */}
                                            <span className="text-xl font-bold tracking-[0.4em] text-gray-700 italic drop-shadow-md decoration-wavy line-through decoration-gray-400 decoration-2">
                                                {captchaText}
                                            </span>
                                            {/* Background noise lines */}
                                            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0tMSwxIGwyLC0yIE0wLDQgbDQsLTQgTTMsNSBsMiwtMiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')]"></div>
                                        </div>

                                        <button type="button" onClick={generateCaptcha} className="h-12 w-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-brandBlue hover:border-brandBlue transition-colors shadow-sm cursor-pointer" title="Refresh Captcha">
                                            <RefreshCw size={20} />
                                        </button>
                                    </div>

                                    <input
                                        type="text"
                                        required
                                        placeholder="Type the 6 letters above"
                                        value={captchaInput}
                                        onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())} // Auto-capitalize
                                        maxLength={6}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brandBlue focus:border-brandBlue outline-none transition-all text-sm font-bold tracking-widest text-center"
                                    />
                                </div>

                                <button type="submit" disabled={loading} className={`w-full text-white py-3.5 rounded-xl font-semibold mt-2 transition-all duration-200 flex justify-center items-center gap-2 shadow-md cursor-pointer ${loading ? 'bg-blue-400 scale-95' : 'bg-brandBlue hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg active:scale-95'}`}>
                                    {loading ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : isLogin ? 'Secure Login' : 'Create Account & Verify'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {/* OTP Verification Screen */}
                {step === 2 && (
                    <div className="p-8 animate-[fadeIn_0.5s_ease-in-out]">
                        <div className="flex justify-center mb-6">
                            <div className="bg-blue-50 p-4 rounded-full relative">
                                <div className="absolute inset-0 bg-brandBlue opacity-20 rounded-full animate-ping"></div>
                                <ShieldCheck size={36} className="text-brandBlue relative z-10" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2 tracking-tight">Verify Your Email</h2>
                        <p className="text-sm text-gray-500 text-center mb-8">We sent a 6-digit code to <br /><span className="font-semibold text-gray-800">{formData.email}</span></p>

                        {message && (
                            <div className={`mb-6 p-3 text-sm font-medium rounded-lg text-center border ${message.includes('failed') || message.includes('error') ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleVerify} className="flex flex-col gap-6">
                            <input type="text" name="otp" required placeholder="------" onChange={handleChange} maxLength={6} className="w-full text-center tracking-[0.75em] font-bold text-3xl py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-brandBlue focus:border-brandBlue outline-none transition-all bg-gray-50 focus:bg-white" />
                            <button type="submit" disabled={loading} className={`w-full text-white py-3.5 rounded-xl font-semibold transition-all duration-200 flex justify-center items-center gap-2 shadow-md cursor-pointer ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'}`}>
                                {loading ? <><Loader2 size={18} className="animate-spin" /> Verifying...</> : 'Verify & Login'}
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="mt-2 text-sm font-medium text-gray-500 hover:text-brandBlue flex items-center justify-center gap-1 transition-colors cursor-pointer hover:underline">
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