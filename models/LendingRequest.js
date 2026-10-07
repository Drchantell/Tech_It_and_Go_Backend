const mongoose = require("mongoose");

const lendingRequestSchema = new mongoose.Schema(
  {
    equipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
      index: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    borrowerName: {
      type: String,
      required: true,
      trim: true,
    },
    borrowerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    checkoutDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined", "returned"],
      default: "pending",
    },
  },
  { timestamps: true }
);

lendingRequestSchema.pre("validate", function validateDates(next) {
  if (this.checkoutDate && this.returnDate && this.returnDate <= this.checkoutDate) {
    this.invalidate("returnDate", "Return date must be after the checkout date.");
  }
  next();
});

module.exports = mongoose.model("LendingRequest", lendingRequestSchema);
