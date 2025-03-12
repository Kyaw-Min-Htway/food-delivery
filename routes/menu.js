const express = require('express');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const router = express.Router();

// Add Menu Item
router.post('/', async (req, res) => {
    try {
        const menuItem = new MenuItem(req.body);
        await menuItem.save();

        // Link with Restaurant
        await Restaurant.findByIdAndUpdate(req.body.restaurant, {
            $push: { menu: menuItem._id }
        });

        res.json(menuItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Menu Items
router.get('/', async (req, res) => {
    try {
        const menuItems = await MenuItem.find().populate('restaurant');
        res.json(menuItems);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
