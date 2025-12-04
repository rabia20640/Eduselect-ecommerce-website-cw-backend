const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");

// POST new order 
router.post("/", async (req, res) => {
    try {
        const db = getDB();
        const result = await db.collection("orders").insertOne(req.body);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: "Failed to create order"});
}
});
module.exports = router;

