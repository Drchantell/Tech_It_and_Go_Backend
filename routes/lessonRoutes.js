const express = require("express");
const mongoose = require("mongoose");

const LessonPlan = require("../models/LessonPlan");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.equipmentId) {
      if (!mongoose.isValidObjectId(req.query.equipmentId)) {
        return res.status(400).json({ message: "equipmentId is not valid." });
      }
      filter.equipmentId = req.query.equipmentId;
    }

    const lessons = await LessonPlan.find(filter)
      .populate("equipmentId", "name category")
      .sort({ title: 1 });

    res.json({ lessons });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Lesson plan was not found." });
    }

    const lesson = await LessonPlan.findById(req.params.id).populate(
      "equipmentId",
      "name category"
    );

    if (!lesson) {
      return res.status(404).json({ message: "Lesson plan was not found." });
    }

    res.json({ lesson });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
