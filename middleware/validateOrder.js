// middleware/validateOrder.js
function validateOrder(req, res, next) {
  const { name, phone, lessonId } = req.body;

  // Name must be letters only
  if (!/^[A-Za-z\s]+$/.test(name)) {
    return res.status(400).json({ error: "Name must contain only letters" });
  }

  // Phone must be 11 digits
  if (!/^\d{11}$/.test(phone)) {
    return res.status(400).json({ error: "Phone must be 11 digits" });
  }

  // LessonId must exist
  if (!lessonId) {
    return res.status(400).json({ error: "Lesson ID is required" });
  }

  next(); // passes control if validation succeeds
}

module.exports = validateOrder;

