const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) return db;

  client = new MongoClient(process.env.MONGO_URI);

  await client.connect();

  db = client.db(process.env.DB_NAME || "eduselect");
  console.log(`Connected to MongoDB Atlas: ${db.databaseName}`);

  return db;
}

function getDB() {
  if (!db) throw new Error("Database not initialized. Call connectDB() first.");
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

module.exports = { connectDB, getDB, closeDB };

