const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Settings = require('../models/Settings');

// Set up image storage for profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, 'profile_' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// 1. GET Request: Fetch settings when the page loads
router.get('/', async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.status(200).json(settings || { owners: [], staffList: [], address: '' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// 2. POST Request: Save settings and upload photos
router.post('/', upload.any(), async (req, res) => {
    try {
        const { owners, staffList, address } = req.body;
        let parsedOwners = JSON.parse(owners || '[]');
        let parsedStaff = JSON.parse(staffList || '[]');

        // Attach uploaded photo URLs to the correct owner/staff member
        if (req.files) {
            req.files.forEach(file => {
                const imageUrl = `http://localhost:5000/uploads/${file.filename}`;
                if (file.fieldname.startsWith('ownerPhoto_')) {
                    const index = parseInt(file.fieldname.split('_')[1]);
                    if (parsedOwners[index]) parsedOwners[index].photo = imageUrl;
                } else if (file.fieldname.startsWith('staffPhoto_')) {
                    const index = parseInt(file.fieldname.split('_')[1]);
                    if (parsedStaff[index]) parsedStaff[index].photo = imageUrl;
                }
            });
        }

        // Find existing settings and update, or create new ones
        let settings = await Settings.findOne();
        if (settings) {
            settings.owners = parsedOwners;
            settings.staffList = parsedStaff;
            settings.address = address;
            await settings.save();
        } else {
            settings = new Settings({ owners: parsedOwners, staffList: parsedStaff, address });
            await settings.save();
        }

        res.status(200).json({ message: 'Settings saved successfully!', settings });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error saving settings' });
    }
});

module.exports = router;