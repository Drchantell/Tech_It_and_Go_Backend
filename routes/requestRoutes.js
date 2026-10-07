const express = require("express");
const mongoose = require("mongoose");

const LendingRequest = require("../models/LendingRequest");
const Equipment = require("../models/Equipment");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function validateDates(checkoutDate, returnDate) {
  const checkout = new Date(checkoutDate);
  const returned = new Date(returnDate);

  if (Number.isNaN(checkout.getTime()) || Number.isNaN(returned.getTime())) {
    return "Please enter valid checkout and return dates.";
  }

  if (checkout < startOfToday()) {
    return "Checkout date cannot be in the past.";
  }

  if (returned <= checkout) {
    return "Return date must be after the checkout date.";
  }

  return "";
}

router.get("/", async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const requestedLimit = parsePositiveInteger(req.query.limit, 10);
    const limit = Math.min(requestedLimit, 50);

    const filter = { ownerId: req.user.userId };
    const total = await LendingRequest.countDocuments(filter);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const safePage = Math.min(page, totalPages);

    const requests = await LendingRequest.find(filter)
      .populate("equipmentId", "name category imageUrl onSiteOnly")
      .sort({ createdAt: -1, _id: -1 })
      .skip((safePage - 1) * limit)
      .limit(limit);

    res.json({
      requests,
      pagination: {
        page: safePage,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Request was not found." });
    }

    const request = await LendingRequest.findOne({
      _id: req.params.id,
      ownerId: req.user.userId,
    }).populate("equipmentId", "name category imageUrl onSiteOnly");

    if (!request) {
      return res.status(404).json({ message: "Request was not found." });
    }

    res.json({ request });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { equipmentId, checkoutDate, returnDate } = req.body;
    const purpose = String(req.body.purpose || "").trim();

    if (!mongoose.isValidObjectId(equipmentId)) {
      return res.status(400).json({ message: "Please choose valid equipment." });
    }

    if (!purpose) {
      return res.status(400).json({ message: "Please explain how you will use the equipment." });
    }

    const dateError = validateDates(checkoutDate, returnDate);

    if (dateError) {
      return res.status(400).json({ message: dateError });
    }

    const [equipment, user] = await Promise.all([
      Equipment.findOne({ _id: equipmentId, archived: false }),
      User.findById(req.user.userId),
    ]);

    if (!equipment) {
      return res.status(404).json({ message: "Equipment was not found." });
    }

    if (!user) {
      return res.status(404).json({ message: "User account was not found." });
    }

    if (equipment.onSiteOnly) {
      return res.status(400).json({
        message: "This equipment is for on-site use and cannot be borrowed.",
      });
    }

    if (equipment.quantityAvailable < 1) {
      return res.status(400).json({
        message: "This equipment is not currently available.",
      });
    }

    const request = await LendingRequest.create({
      equipmentId: equipment._id,
      ownerId: user._id,
      borrowerName: user.name,
      borrowerEmail: user.email,
      checkoutDate,
      returnDate,
      purpose,
    });

    await request.populate("equipmentId", "name category imageUrl onSiteOnly");

    res.status(201).json({ request });
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Request was not found." });
    }

    const request = await LendingRequest.findOne({
      _id: req.params.id,
      ownerId: req.user.userId,
    });

    if (!request) {
      return res.status(404).json({ message: "Request was not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be edited.",
      });
    }

    const checkoutDate = req.body.checkoutDate ?? request.checkoutDate;
    const returnDate = req.body.returnDate ?? request.returnDate;
    const dateError = validateDates(checkoutDate, returnDate);

    if (dateError) {
      return res.status(400).json({ message: dateError });
    }

    if (Object.prototype.hasOwnProperty.call(req.body, "purpose")) {
      const purpose = String(req.body.purpose || "").trim();

      if (!purpose) {
        return res.status(400).json({ message: "Purpose cannot be empty." });
      }

      request.purpose = purpose;
    }

    request.checkoutDate = checkoutDate;
    request.returnDate = returnDate;

    await request.save();
    await request.populate("equipmentId", "name category imageUrl onSiteOnly");

    res.json({ request });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ message: "Request was not found." });
    }

    const request = await LendingRequest.findOne({
      _id: req.params.id,
      ownerId: req.user.userId,
    });

    if (!request) {
      return res.status(404).json({ message: "Request was not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Only pending requests can be deleted.",
      });
    }

    await request.deleteOne();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
