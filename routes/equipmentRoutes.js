const express = require("express");
const mongoose = require("mongoose");

const Equipment = require("../models/Equipment");
const LendingRequest = require("../models/LendingRequest");
const { authenticate, requireStaff } = require("../middleware/auth");

const router = express.Router();

const editableFields = [
  "name",
  "category",
  "description",
  "imageUrl",
  "quantityAvailable",
  "skillLevel",
  "safetyNotes",
  "onSiteOnly",
  "archived",
];

function pickFields(source) {
  return Object.fromEntries(
    editableFields
      .filter((field) => Object.prototype.hasOwnProperty.call(source, field))
      .map((field) => [field, source[field]])
  );
}

router.get("/", async (req, res, next) => {
  try {
    const filter = { archived: false };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.available === "true") {
      filter.quantityAvailable = { $gt: 0 };
    }

    if (req.query.search) {
      const safeSearch = String(req.query.search)
        .trim()
        .replace(/[^a-zA-Z0-9\s-]/g, "");

      if (safeSearch) {
        const pattern = new RegExp(safeSearch, "i");
        filter.$or = [{ name: pattern }, { description: pattern }];
      }
    }

    const items = await Equipment.find(filter).sort({ name: 1 });
    res.json({ equipment: items });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    const item = await Equipment.findOne({
      _id: req.params.id,
      archived: false,
    });

    if (!item) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    res.json({ equipment: item });
  } catch (error) {
    next(error);
  }
});

router.post("/", authenticate, requireStaff, async (req, res, next) => {
  try {
    const item = await Equipment.create(pickFields(req.body));
    res.status(201).json({ equipment: item });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authenticate, requireStaff, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    const item = await Equipment.findByIdAndUpdate(
      req.params.id,
      pickFields(req.body),
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    res.json({ equipment: item });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authenticate, requireStaff, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    const item = await Equipment.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    const requestCount = await LendingRequest.countDocuments({
      equipmentId: item._id,
    });

    if (requestCount > 0) {
      item.archived = true;
      await item.save();
      return res.json({
        message: "Equipment was archived because it has lending history.",
        archived: true,
      });
    }

    await item.deleteOne();
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
