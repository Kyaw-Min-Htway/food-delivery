const mongoose = require('mongoose');

const RiderSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    password: String,
    available: { type: Boolean, default: true },
    currentLocation: {
        latitude: Number,
        longitude: Number
    }
});

module.exports = mongoose.model("Rider", RiderSchema);
