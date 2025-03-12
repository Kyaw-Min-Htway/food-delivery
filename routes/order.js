const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Rider = require('../models/Rider');

const router = express.Router();

// Place Order
router.post('/place', async (req, res) => {
    try {
        const { user, restaurant } = req.body;
        const cart = await Cart.findOne({ user }).populate('items.menuItem');

        if (!cart) return res.status(400).json({ error: "Cart is empty" });

        const totalPrice = cart.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);

        const order = new Order({
            user,
            restaurant,
            items: cart.items,
            totalPrice,
            status: 'pending'
        });

        await order.save();
        await Cart.findOneAndDelete({ user });

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get User Orders
router.get('/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate('items.menuItem');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update-status', async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if (!order) return res.status(404).json({ error: "Order not found" });

        // Emit real-time update
        io.emit('orderStatusUpdated', order);

        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.post('/assign-rider', async (req, res) => {
    try {
        const { orderId } = req.body;
        const availableRider = await Rider.findOne({ available: true });

        if (!availableRider) return res.status(400).json({ error: "No available rider" });

        const order = await Order.findByIdAndUpdate(orderId, { riderId: availableRider._id, status: "assigned" }, { new: true });
        availableRider.available = false;
        await availableRider.save();

        io.emit('orderAssigned', order); // Notify riders
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;
