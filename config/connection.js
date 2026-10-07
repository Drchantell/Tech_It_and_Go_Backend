const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === "YOUR_MONGODB_ATLAS_CONNECTION_STRING") {
    throw new Error("Add your MongoDB connection string to MONGO_URI in .env.");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB connected successfully!");
}

module.exports = connectDB;
