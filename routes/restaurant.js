const express = require('express');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const router = express.Router();

// Create Restaurant
router.post('/', async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('menu');
        res.json(restaurants);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Restaurant
router.get('/:id', async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id).populate('menu');
        res.json(restaurant);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
