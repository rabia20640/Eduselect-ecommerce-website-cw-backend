require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => res.send("Eduselect backend is running"));

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("❌ Failed to start server:", err);
    }
})();

const lessonsRoutes = require ("./routes/lessons");
const ordersRoutes = require ("./routes/orders");

// After middleware 
app.use("/lessons", lessonsRoutes);
app.use("/orders", ordersRoutes);
