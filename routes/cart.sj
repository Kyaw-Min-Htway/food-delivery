const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();

// Add to Cart
router.post('/add', async (req, res) => {
    try {
        const { user, menuItem, quantity } = req.body;
        let cart = await Cart.findOne({ user });

        if (!cart) {
            cart = new Cart({ user, items: [{ menuItem, quantity }] });
        } else {
            const itemIndex = cart.items.findIndex(i => i.menuItem.toString() === menuItem);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ menuItem, quantity });
            }
        }

        await cart.save();
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Cart
router.get('/:userId', async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.params.userId }).populate('items.menuItem');
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
