const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Server } = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    console.log("Client connected:", socket.id);

    // Listen for order status updates
    socket.on('updateOrderStatus', async ({ orderId, status }) => {
        try {
            const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
            io.emit('orderStatusUpdated', order); // Send update to all clients
        } catch (err) {
            console.error("Error updating order:", err);
        }
    });

    socket.on('disconnect', () => {
        console.log("Client disconnected:", socket.id);
    });
});


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(5000, () => console.log("Server running on port 5000"));
