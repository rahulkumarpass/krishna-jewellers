# Krishna Jewelry and Readymade - E-Commerce Platform

A full-stack, custom e-commerce web application built for a local jewelry and readymade clothing business. It features a secure admin dashboard for inventory management, location-based delivery checks, and seamless WhatsApp ordering integration.

## 🚀 Tech Stack

- **Frontend:** React.js (Vite), Tailwind CSS, React Router, Lucide Icons, Swiper.js
- **Backend:** Node.js, Express.js, Multer (for image uploads)
- **Database:** MongoDB & Mongoose
- **Workflow:** Concurrently (running both servers from a single master script)

## ✨ Key Features

- **Local Delivery Check:** Built-in Geolocation API combined with the Haversine formula to verify if customers are within a 5km radius of the shop in Kurhani.
- **Frictionless Ordering:** Direct "WhatsApp" and "Call Now" buttons that dynamically respect store business hours (8 AM - 8 PM).
- **Secure Admin Dashboard:** A protected route for the shop owner to upload products, manage inventory by size, and upload up to 6 high-resolution images per item.
- **Dynamic Inventory Display:** Real-time visual indicators showing customers exactly how many items are left in specific sizes.

## 📂 Project Structure

|-- backend/ # Node.js & Express API
| |-- models/ # MongoDB schemas (Product.js)
| |-- routes/ # API endpoints (productRoutes.js)
| |-- uploads/ # Local storage for product images
| |-- .env # Secret environment variables (ignored in git)
| |-- server.js # Main backend entry point
|-- frontend/ # React & Vite Client App
| |-- public/ # Static assets
| |-- src/  
| | |-- assets/  
| | |-- components/ # Reusable UI parts (Admin, Header, ProductGrid, etc.)
| | |-- App.jsx # Main React Router setup
| | |-- main.jsx # React DOM render entry
| |-- vite.config.js # Vite bundler configuration
|-- package.json # Master startup script (Concurrently)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/krishna-jewellers.git](https://github.com/yourusername/krishna-jewellers.git)
   cd krishna-jewellers
   ```
