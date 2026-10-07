const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Tech It and Go backend!" });
});

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res.status(connected ? 200 : 503).json({
    server: "running",
    database: connected ? "connected" : "disconnected",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "This route was not found." });
});

app.use((error, req, res, next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Please send valid JSON." });
  }
  if (error.type === "entity.too.large") {
    return res.status(413).json({ message: "The request is too large." });
  }
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

module.exports = app;
