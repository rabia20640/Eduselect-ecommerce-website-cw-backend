// middleware/errorHandler.js
const { logError } = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logError("Unhandled error", err);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal Server Error",
  });
}

module.exports = errorHandler;

