import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, Clock, Calendar, User, Store } from 'lucide-react';

const ContactUs = () => {
  const [isContactable, setIsContactable] = useState(false);

  // Check the current time to enable/disable contact buttons
  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      // 8 AM is 8, 8 PM is 20 (24-hour format)
      if (currentHour >= 8 && currentHour < 20) {
        setIsContactable(true);
      } else {
        setIsContactable(false);
      }
    };

    checkTime();
    // Updates every minute just in case the user leaves the tab open
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Shop Details Data (You can change these names and numbers)
  const owner = { name: "Shop Owner", role: "Owner", phone: "919876543210" };
  const staff = { name: "Shop Staff", role: "Manager", phone: "919876543211" };

  return (
    <section className="my-10 bg-white p-6 md:p-10 shadow-sm rounded-sm">
      <div className="border-b border-gray-100 pb-4 mb-8 text-center">
        <h2 className="text-3xl font-normal text-gray-800">About Our Shop</h2>
        <p className="text-gray-500 mt-2">Get to know the team behind Krishna Jewelry and Readymade</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Left Side: Shop Timings */}
        <div className="bg-blue-50 p-6 rounded-sm border border-blue-100 flex flex-col justify-center">
          <h3 className="text-xl font-medium text-gray-800 mb-6 flex items-center gap-2">
            <Store className="text-brandBlue" /> Shop Information
          </h3>

          <div className="flex items-start gap-4 mb-4">
            <Calendar className="text-brandBlue mt-1" />
            <div>
              <p className="font-medium text-gray-800">Days Open</p>
              <p className="text-gray-600">Monday to Sunday (Everyday)</p>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <Clock className="text-brandBlue mt-1" />
            <div>
              <p className="font-medium text-gray-800">Shop Timings</p>
              <p className="text-gray-600">8:00 AM to 8:30 PM</p>
            </div>
          </div>

          <div className="mt-auto p-3 bg-white rounded border border-gray-200 text-sm text-gray-600">
            <strong>Note:</strong> Phone calls and WhatsApp messages are only monitored between <strong>8:00 AM and 8:00 PM</strong>.
          </div>
        </div>

        {/* Right Side: Profiles & Contact Buttons */}
        <div className="flex flex-col gap-6">

          {/* Owner Profile */}
          <div className="border border-gray-200 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                <User size={32} />
              </div>
              <div>
                <h4 className="font-medium text-lg text-gray-800">{owner.name}</h4>
                <p className="text-sm text-gray-500">{owner.role}</p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={isContactable ? `tel:+${owner.phone}` : "#"}
                className={`flex-1 sm:flex-none p-3 rounded-sm flex items-center justify-center transition-colors ${isContactable ? 'bg-brandBlue text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                title={!isContactable ? "Calling available 8 AM to 8 PM" : "Call Owner"}
              >
                <Phone size={20} />
              </a>
              <a
                href={isContactable ? `https://wa.me/${owner.phone}` : "#"}
                target={isContactable ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`flex-1 sm:flex-none p-3 rounded-sm flex items-center justify-center transition-colors ${isContactable ? 'bg-[#25D366] text-white hover:bg-[#128C7E] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                title={!isContactable ? "WhatsApp available 8 AM to 8 PM" : "WhatsApp Owner"}
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Staff Profile */}
          <div className="border border-gray-200 p-4 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="bg-gray-100 p-3 rounded-full text-gray-600">
                <User size={32} />
              </div>
              <div>
                <h4 className="font-medium text-lg text-gray-800">{staff.name}</h4>
                <p className="text-sm text-gray-500">{staff.role}</p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              <a
                href={isContactable ? `tel:+${staff.phone}` : "#"}
                className={`flex-1 sm:flex-none p-3 rounded-sm flex items-center justify-center transition-colors ${isContactable ? 'bg-brandBlue text-white hover:bg-blue-700 cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                title={!isContactable ? "Calling available 8 AM to 8 PM" : "Call Staff"}
              >
                <Phone size={20} />
              </a>
              <a
                href={isContactable ? `https://wa.me/${staff.phone}` : "#"}
                target={isContactable ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className={`flex-1 sm:flex-none p-3 rounded-sm flex items-center justify-center transition-colors ${isContactable ? 'bg-[#25D366] text-white hover:bg-[#128C7E] cursor-pointer' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                title={!isContactable ? "WhatsApp available 8 AM to 8 PM" : "WhatsApp Staff"}
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactUs;