const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Product = require('../models/Product'); // Import your database schema

// --- MULTER CONFIGURATION FOR IMAGE UPLOADS ---
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Saves files to the backend/uploads folder
    },
    filename: function (req, file, cb) {
        // Creates a unique filename so images don't overwrite each other
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit per image
});


// --- POST: ADD A NEW PRODUCT (Admin Only) ---
// The upload.array('images', 6) middleware accepts up to 6 images
router.post('/', upload.array('images', 6), async (req, res) => {
    try {
        const { title, serialNo, price, originalPrice, category, description, inventory } = req.body;

        // Generate URLs for the uploaded images so React can display them
        const imageUrls = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);

        // Because form data sends objects as strings, we must parse the inventory
        const parsedInventory = JSON.parse(inventory);

        // Calculate the discount percentage automatically
        const discount = Math.round(((originalPrice - price) / originalPrice) * 100);

        // Create the new product object
        const newProduct = new Product({
            title,
            serialNo,
            price,
            originalPrice,
            discount,
            category,
            description,
            inventory: parsedInventory,
            images: imageUrls
        });

        // Save to MongoDB
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: 'Product added successfully!', product: savedProduct });

    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
});


// --- GET: FETCH ALL PRODUCTS (For the Home Page) ---
router.get('/', async (req, res) => {
    try {
        // Sort by newest first
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products' });
    }
});


// --- GET: FETCH SINGLE PRODUCT BY ID (For the Product Detail Page) ---
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product details' });
    }
});

// UPDATE an existing product
router.put('/:id', upload.array('images', 6), async (req, res) => {
    try {
        const { title, serialNo, price, originalPrice, category, description, inventory } = req.body;

        // 1. Check if another product already uses this serialNo
        const existingProduct = await Product.findOne({ serialNo, _id: { $ne: req.params.id } });
        if (existingProduct) {
            return res.status(400).json({ message: 'This Serial Number is already assigned to another product.' });
        }

        const updateData = {
            title, serialNo, price, originalPrice, category, description,
            inventory: JSON.parse(inventory)
        };

        // 2. Only update the images if the admin uploaded new ones
        if (req.files && req.files.length > 0) {
            updateData.images = req.files.map(file => `http://localhost:5000/uploads/${file.filename}`);
        }

        // 3. Save the updates
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;