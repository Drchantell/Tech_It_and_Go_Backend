const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "3D Printing",
        "Robotics",
        "Computers",
        "Coding",
        "Digital Fabrication",
        "Entrepreneurship",
        "Emerging Technology",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    imageUrl: {
      type: String,
      default: "",
      trim: true,
    },
    quantityAvailable: {
      type: Number,
      min: 0,
      default: 0,
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number.",
      },
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
    },
    safetyNotes: {
      type: String,
      default: "",
      trim: true,
    },
    onSiteOnly: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
