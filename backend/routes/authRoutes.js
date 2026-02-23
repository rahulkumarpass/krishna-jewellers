const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});
// 1. REGISTER & SEND OTP
router.post('/register', async (req, res) => {
    try {
        const { name, phone, email, password } = req.body;

        let user = await User.findOne({ email });
        if (user && user.isVerified) return res.status(400).json({ message: 'Email already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        if (user) {
            user.name = name; user.phone = phone; user.password = hashedPassword;
            user.otp = otp; user.otpExpiry = otpExpiry;
        } else {
            user = new User({ name, phone, email, password: hashedPassword, otp, otpExpiry });
        }
        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your account - Krishna Jewelry',
            html: `<h3>Welcome ${name}!</h3><p>Your OTP is: <b>${otp}</b> (Valid for 5 mins).</p>`
        });

        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (err) {
        res.status(500).json({ message: 'Error registering user.' });
    }
});
// 2. VERIFY OTP
router.post('/verify', async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP.' });
        if (new Date() > user.otpExpiry) return res.status(400).json({ message: 'OTP expired.' });

        user.isVerified = true;
        user.otp = null; user.otpExpiry = null;
        await user.save();

        res.status(200).json({ message: 'Account verified!', user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
});
// 3. LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: 'User not found.' });
        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid password.' });

        res.status(200).json({ message: 'Login successful', user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) {
        res.status(500).json({ message: 'Error logging in.' });
    }
});
module.exports = router;