const mongoose = require('mongoose');

// Blueprint for a Person (Owner or Staff)
const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    photo: { type: String, default: null } // This will hold the image URL
});

// Blueprint for the Shop Settings
const settingsSchema = new mongoose.Schema({
    owners: [personSchema],
    staffList: [personSchema],
    address: { type: String, required: true }
});

module.exports = mongoose.model('Settings', settingsSchema);