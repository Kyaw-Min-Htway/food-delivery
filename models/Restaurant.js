const mongoose = require('mongoose');

const RestaurantSchema = new mongoose.Schema({
    name: String,
    image: String,
    category: String,
    address: String,
    menu: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' }]
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
