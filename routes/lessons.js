const express = require("express");
const router = express.Router();
const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

// GET all lessons
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const lessons = await db.collection("lessons").find({}).toArray(); // Fetch all lessons from the database
    res.json(lessons);
  } catch (err) {
    console.error("Failed to fetch lessons:", err);
    res.status(500).json({ error: "Failed to fetch lessons" });
  }
});

// POST /lessons - create a new lesson
router.post("/", async (req, res) => {
  const { topic, location, price, space } = req.body;
  const errors = [];

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    errors.push("Topic is required and must be a non-empty string.");
  }
  if (!location || typeof location !== "string" || !location.trim()) {
    errors.push("Location is required and must be a non-empty string.");
  }
  const priceNum = Number(price);
  if (Number.isNaN(priceNum) || priceNum < 0) {
    errors.push("Price is required and must be a non-negative number.");
  }
  const spaceNum = Number(space);
  if (!Number.isInteger(spaceNum) || spaceNum < 0) {
    errors.push("Space is required and must be a non-negative integer.");
  }

  if (errors.length) {
    return res.status(400).json({ errors });
  }

  const lessonDoc = {
    topic: topic.trim(),
    location: location.trim(),
    price: priceNum,
    space: spaceNum,
    createdAt: new Date(),
  };

  try {
    const db = getDB();
    const result = await db.collection("lessons").insertOne(lessonDoc);
    lessonDoc._id = result.insertedId;
    return res.status(201).json(lessonDoc);
  } catch (err) {
    console.error("Failed to create lesson:", err);
    return res.status(500).json({ error: "Failed to create lesson" });
  }
});

// PUT /lessons/:id - Adjust spaces for a lesson
router.put("/:id", async (req, res) => {
  try {
    const db = getDB();
    const lessonId = req.params.id;
    const { space, delta } = req.body; // accept either

    if (space === undefined && delta === undefined) {
      return res.status(400).json({ error: 'Provide either "space" (integer) or "delta" (integer).' });
    }

    const lesson = await db.collection("lessons").findOne({ _id: new ObjectId(lessonId) });
    if (!lesson) return res.status(404).json({ error: "Lesson not found." });

    // handle both possible field names in your DB
    const spaceField = lesson.space !== undefined ? "space" : (lesson.spaces !== undefined ? "spaces" : "space");
    const currentSpace = Number(lesson[spaceField] ?? 0);

    // Set absolute space
    if (space !== undefined) {
      const spaceNum = Number(space);
      if (!Number.isInteger(spaceNum) || spaceNum < 0) {
        return res.status(400).json({ error: "space must be a non-negative integer." });
      }
      await db.collection("lessons").updateOne(
        { _id: new ObjectId(lessonId) },
        { $set: { [spaceField]: spaceNum } }
      );
      const updated = await db.collection("lessons").findOne({ _id: new ObjectId(lessonId) });
      return res.json({ message: "space set", lesson: updated });
    }

    // Apply delta
    const deltaNum = Number(delta);
    if (!Number.isInteger(deltaNum)) {
      return res.status(400).json({ error: "delta must be an integer." });
    }
    if (currentSpace + deltaNum < 0) {
      return res.status(400).json({ error: "Not enough spaces available." });
    }
    await db.collection("lessons").updateOne(
      { _id: new ObjectId(lessonId) },
      { $inc: { [spaceField]: deltaNum } }
    );
    const updated = await db.collection("lessons").findOne({ _id: new ObjectId(lessonId) });
    return res.json({ message: `Lesson ${spaceField} adjusted by ${deltaNum}`, lesson: updated });
  } catch (err) {
    console.error("Failed to update lesson spaces:", err);
    res.status(500).json({ error: "Failed to update lesson spaces" });
  }
});

module.exports = router;

