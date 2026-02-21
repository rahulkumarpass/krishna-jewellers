const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// IMPORTANT: This allows React to view the images inside the /uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Database'))
  .catch((err) => console.log('❌ Database connection error:', err));

// Secure Admin Login API
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    res.status(200).json({ message: 'Login successful', isAdmin: true });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
});

// --- NEW: USE PRODUCT ROUTES ---
app.use('/api/products', require('./routes/productRoutes'));

// Basic route to test if server is alive
app.get('/', (req, res) => {
  res.send('Krishna Jewelry and Readymade API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend Server running on http://localhost:${PORT}`);
});