const express = require("express");
const router = express.Router();
const {getDB} = require("../config/db");

// GET all lessons 
router.get("/", async (req, res) => {
    try {
        const db = getDB();
        const lessons = await db.collection("lessons").find().toArray();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch lessons" });
    }
});

module.exports = router;