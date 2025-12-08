function logInfo(message) {
  console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
}

function logWarn(message) {
  console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
}

function logError(message, err = null) {
  console.error(`[ERROR] ${new Date().toISOString()} - ${message}`);
  if (err) {
    console.error(err.stack || err);
  }
}

module.exports = {
  logInfo,
  logWarn,
  logError
};

