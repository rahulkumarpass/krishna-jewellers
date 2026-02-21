const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  serialNo: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  description: { type: String, required: true },
  
  // Up to 6 image URLs
  images: [{ type: String }], 
  
  // Inventory tracking (e.g., [{ size: 'M', quantity: 12 }])
  inventory: [{
    size: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 }
  }],
  
  rating: { type: Number, default: 4.5 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);