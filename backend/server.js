require('dotenv').config(); // Allows you to use .env files for passwords and secret keys
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// === 1. ADD THIS LINE ===
const path = require('path');

const app = express();
app.use(cors());
// Allows your server to read JSON data from frontend requests
app.use(express.json());

// === 2. ADD THIS LINE ===
// This exposes your 'uploads' folder to the internet so React can see the photos!
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// === 2. SECURITY: RATE LIMITER ===
// Protects your email OTP system from being spammed by bots
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour in milliseconds
  max: 20, // Limit each IP to exactly 20 requests per hour
  message: {
    message: "Too many login or signup attempts from this IP. To protect our system, please try again in exactly one hour."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// We apply the 'authLimiter' strictly to the /api/auth route so it doesn't block product browsing!
app.use('/api/auth', authLimiter, require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/krishna_jewellers';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB successfully!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend server is running on http://localhost:${PORT}`);
});