const { logInfo } = require("../utils/logger");

function loggerMiddleware(req, res, next) {
  const message = `${req.method} ${req.originalUrl} - ${new Date().toISOString()}`;
  logInfo(message);
  next();
}

module.exports = loggerMiddleware;

