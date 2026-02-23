import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CategoryRow from './components/CategoryRow';
import ProductGrid from './components/ProductGrid';
import ProductDetail from './components/ProductDetail';
import CategoryPage from './components/CategoryPage';
import SearchPage from './components/SearchPage';
import Wishlist from './components/Wishlist';
import ContactUs from './components/ContactUs';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="max-w-7xl mx-auto px-4 py-2 flex-grow w-full">
          <Routes>
            {/* Main Homepage */}
            <Route
              path="/"
              element={
                <>
                  <HeroSlider />
                  <CategoryRow />
                  <ProductGrid />
                  <ContactUs />
                </>
              }
            />

            {/* Dynamic Customer Views */}
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/wishlist" element={<Wishlist />} />

            {/* Secure Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;