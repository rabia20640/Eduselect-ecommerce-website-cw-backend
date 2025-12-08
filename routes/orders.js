const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// Helper: validate order data
function validateOrder(order) {
  const errors = [];

  // Name validation: letters only, 2–50 chars
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  if (!order.name || !nameRegex.test(order.name)) {
    errors.push("Name must be 2–50 letters only.");
  }

  // Phone validation: UK mobile style (07 + 9 digits = 11 total)
  const phoneRegex = /^07\d{9}$/;
  if (!order.phone || !phoneRegex.test(order.phone)) {
    errors.push("Phone number must be 11 digits and start with 07.");
  }

  // Items validation
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    errors.push("Order must include at least one lesson.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// GET all orders
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const orders = await db.collection("orders").find({}).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// POST new order
router.post("/", async (req, res) => {
  try {
    const db = getDB();
    const order = req.body;

    // Validate order
    const { isValid, errors } = validateOrder(order);
    if (!isValid) {
      return res.status(400).json({ errors });
    }


    const result = await db.collection("orders").insertOne({
      ...order,
      createdAt: new Date()
    });

    res.status(201).json({
      message: "Order created successfully",
      _id: result.insertedId,
      ...order
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
});

module.exports = router;