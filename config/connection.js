const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DB_NAME || "TechItAndGo";

  if (!uri || uri === "YOUR_MONGODB_ATLAS_CONNECTION_STRING") {
    throw new Error("Add your MongoDB connection string to MONGO_URI in .env.");
  }

  await mongoose.connect(uri, {
    dbName,
    serverSelectionTimeoutMS: 10000,
  });

  console.log(`MongoDB connected successfully to ${dbName}!`);
}

module.exports = connectDB;
