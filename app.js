const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes");
const equipmentRoutes = require("./routes/equipmentRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json({ limit: "100kb" }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Tech It & Go! backend." });
});

app.get("/api/health", (req, res) => {
  const connected = mongoose.connection.readyState === 1;

  res.status(connected ? 200 : 503).json({
    server: "running",
    database: connected ? "connected" : "disconnected",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/requests", requestRoutes);

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

  if (error.name === "ValidationError") {
    const firstMessage = Object.values(error.errors)[0]?.message;
    return res.status(400).json({
      message: firstMessage || "Please check the information you entered.",
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "One of the supplied values is not valid." });
  }

  console.error(error);
  res.status(500).json({ message: "Something went wrong. Please try again." });
});

module.exports = app;
