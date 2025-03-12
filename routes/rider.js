const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Rider = require('../models/Rider');

const router = express.Router();

// Rider Signup
router.post('/signup', async (req, res) => {
    const { name, phone, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newRider = new Rider({ name, phone, email, password: hashedPassword });
        await newRider.save();
        res.status(201).json({ message: "Rider registered successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rider Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const rider = await Rider.findOne({ email });

    if (!rider) return res.status(404).json({ error: "Rider not found" });

    const isValid = await bcrypt.compare(password, rider.password);
    if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, rider });
});

module.exports = router;
