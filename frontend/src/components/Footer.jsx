import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-10 py-8">
            <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center gap-2">
                <h3 className="text-xl font-bold tracking-wide">Krishna Jewelry and Readymade</h3>
                <p className="text-gray-400 text-sm">X8MM+3VW, Kurhani, Bihar 844120</p>

                <div className="w-full md:w-1/2 mt-6 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                    <p>&copy; {new Date().getFullYear()} All rights reserved.</p>

                    {/* Subtle Admin Login Link */}
                    <Link to="/admin" className="hover:text-white transition-colors cursor-pointer">
                        Admin Login
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;