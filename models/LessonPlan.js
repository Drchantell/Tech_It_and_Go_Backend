const mongoose = require("mongoose");

const lessonPlanSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    objectives: {
      type: [String],
      default: [],
    },
    materials: {
      type: [String],
      default: [],
    },
    steps: {
      type: [String],
      default: [],
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "All Levels"],
      default: "Beginner",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LessonPlan", lessonPlanSchema);
