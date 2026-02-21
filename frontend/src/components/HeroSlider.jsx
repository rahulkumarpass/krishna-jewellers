import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Swiper CSS imports
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSlider = () => {
    // Array of slides representing your 3-4 sliding images
    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
            title: "Summer Collection 2026",
            subtitle: "Discover the latest trends in readymade fashion"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1200&auto=format&fit=crop",
            title: "Exclusive Jewelry",
            subtitle: "Elegant designs for every occasion"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200&auto=format&fit=crop",
            title: "New Arrivals",
            subtitle: "Upgrade your wardrobe today"
        }
    ];

    return (
        <div className="w-full mb-10 mt-4 rounded-sm overflow-hidden shadow-sm">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                    delay: 3500, // Changes image every 3.5 seconds
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="w-full h-[300px] md:h-[450px]" // Responsive height
            >
                {slides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div
                            className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center relative"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Dark Overlay so the white text is readable against the background */}
                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>

                            {/* Text Content */}
                            <div className="relative z-10 text-center text-white px-4">
                                <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-lg">{slide.title}</h2>
                                <p className="text-lg md:text-xl mb-6 drop-shadow-md">{slide.subtitle}</p>
                                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-6 rounded-sm shadow-md transition-colors duration-200 cursor-pointer">
                                    Shop Now
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default HeroSlider;