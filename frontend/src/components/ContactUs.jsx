import React, { useState, useEffect } from 'react';
import { Store, Calendar, Clock, Phone, MessageCircle, User, MapPin, Loader2 } from 'lucide-react';

const ContactUs = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the live shop settings from your database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Failed to fetch shop settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Use the database settings, or fallback to default if the database is empty
  const owners = settings ? settings.owners : [{ name: 'Shop Owner', phone: '919876543210' }];
  const staffList = settings ? settings.staffList : [{ name: 'Shop Staff', phone: '919876543211' }];
  const address = settings?.address || 'X8MM+3VW, Kurhani, Bihar 844120';

  return (
    <section className="my-10 bg-white p-6 shadow-sm rounded-sm border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-normal text-gray-800">About Our Shop</h2>
        <p className="text-gray-500 mt-2">Get to know the team behind Krishna Jewelry and Readymade</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10 text-brandBlue">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8">

          {/* Left Column: Shop Info */}
          <div className="w-full md:w-1/2 bg-blue-50 p-6 rounded-sm border border-blue-100 flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-full text-brandBlue shadow-sm shrink-0">
                <Store size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Shop Information</h3>
                <p className="text-gray-600 text-sm mt-1 flex items-start gap-1">
                  <MapPin size={16} className="mt-0.5 shrink-0" /> {address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-full text-brandBlue shadow-sm shrink-0">
                <Calendar size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Days Open</h3>
                <p className="text-gray-600 text-sm mt-1">Monday to Sunday (Everyday)</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-white p-2 rounded-full text-brandBlue shadow-sm shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Shop Timings</h3>
                <p className="text-gray-600 text-sm mt-1">8:00 AM to 8:30 PM</p>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-blue-200">
              <p className="text-xs text-gray-500 italic">
                <strong>Note:</strong> Phone calls and WhatsApp messages are only monitored between 8:00 AM and 8:00 PM.
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Owners and Staff */}
          <div className="w-full md:w-1/2 flex flex-col gap-4">

            {/* Render Owners */}
            {owners.map((owner, index) => (
              <div key={`owner-${index}`} className="border border-gray-200 p-4 rounded-sm flex items-center justify-between bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {/* Show Profile Photo if available, otherwise show User Icon */}
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden shrink-0 border border-gray-200">
                    {owner.photo ? (
                      <img src={owner.photo} alt={owner.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{owner.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Owner</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:+${owner.phone}`} className="w-10 h-10 bg-brandBlue text-white rounded-sm flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm cursor-pointer" title="Call Now">
                    <Phone size={18} />
                  </a>
                  <a href={`https://wa.me/${owner.phone}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-sm flex items-center justify-center hover:bg-[#128C7E] transition-colors shadow-sm cursor-pointer" title="WhatsApp">
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            ))}

            {/* Render Staff */}
            {staffList.map((staff, index) => (
              <div key={`staff-${index}`} className="border border-gray-200 p-4 rounded-sm flex items-center justify-between bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 overflow-hidden shrink-0 border border-gray-200">
                    {staff.photo ? (
                      <img src={staff.photo} alt={staff.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{staff.name}</h4>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Staff</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a href={`tel:+${staff.phone}`} className="w-10 h-10 bg-brandBlue text-white rounded-sm flex items-center justify-center hover:bg-blue-700 transition-colors shadow-sm cursor-pointer" title="Call Now">
                    <Phone size={18} />
                  </a>
                  <a href={`https://wa.me/${staff.phone}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-[#25D366] text-white rounded-sm flex items-center justify-center hover:bg-[#128C7E] transition-colors shadow-sm cursor-pointer" title="WhatsApp">
                    <MessageCircle size={18} />
                  </a>
                </div>
              </div>
            ))}

          </div>
        </div>
      )}
    </section>
  );
};

export default ContactUs;