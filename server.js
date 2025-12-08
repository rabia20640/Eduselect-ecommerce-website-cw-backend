require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, closeDB } = require("./config/db");

const lessonsRoutes = require("./routes/lessons");
const ordersRoutes = require("./routes/orders");
const errorHandler = require("./middleware/errorHandler");
const loggerMiddleware = require("./middleware/logger");

const app = express(); // <-- define app first
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://eduselect-ecommerce-website-cw-backend.onrender.com",
  ],
  methods: ["GET", "POST", "PUT"],
  allowedHeaders: ["Content-Type"],
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(loggerMiddleware); 

// Health check route
app.get("/", (req, res) => res.send("Eduselect backend is running"));

// Routes
app.use("/lessons", lessonsRoutes);
app.use("/orders", ordersRoutes);

// Error handling middleware
app.use(errorHandler);

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
})();

// shutdown
process.on("SIGINT", async () => {
  await closeDB();
  process.exit(0);
});

