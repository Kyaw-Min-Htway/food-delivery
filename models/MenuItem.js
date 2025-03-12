const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
