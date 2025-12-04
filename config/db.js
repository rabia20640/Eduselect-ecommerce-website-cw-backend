const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDB() {
  if (db) return db; // reuse if already connected

  client = new MongoClient(process.env.MONGO_URI);
  await client.connect();

  db = client.db("eduselect"); // <-- use your database name here
  console.log("✅ Connected to MongoDB Atlas");

  return db;
}

function getDB() {
  if (!db) throw new Error("Database not initialized");
  return db;
}

module.exports = { connectDB, getDB };

