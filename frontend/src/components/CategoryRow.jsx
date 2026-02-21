import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, PersonStanding, Baby, Gem } from 'lucide-react'; // Removed Tag icon

// Core categories for Krishna Jewelry and Readymade
const categories = [
    { name: "Men's Wear", icon: Shirt, path: "/category/mens" },
    { name: "Women's Wear", icon: PersonStanding, path: "/category/womens" },
    { name: "Kids Wear", icon: Baby, path: "/category/kids" },
    { name: "Accessories", icon: Gem, path: "/category/accessories" },
];

const CategoryRow = () => {
    return (
        <section className="my-10">
            {/* Section Title */}
            <h2 className="text-3xl font-normal text-center text-gray-800 mb-8">
                Shop by Category
            </h2>

            {/* Category Cards Container */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                {categories.map((cat, index) => {
                    const Icon = cat.icon;
                    return (
                        <Link
                            key={index}
                            to={cat.path}
                            className="flex flex-col items-center justify-center bg-white w-32 h-32 md:w-40 md:h-40 rounded-sm shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        >
                            {/* Blue Icon */}
                            <Icon size={42} className="text-brandBlue mb-4" />
                            {/* Category Name */}
                            <span className="text-sm md:text-base font-medium text-gray-800">
                                {cat.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
};

export default CategoryRow;