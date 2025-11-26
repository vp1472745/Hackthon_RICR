// src/models/Payment.js
import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    referenceId: {
      type: String,
      required: true,
      unique: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
    screenshot: {
      type: String, // store file path or Cloudinary URL
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Verified", "Rejected"],
      default: "Pending",
    },

    // audit & credential fields
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Types.ObjectId, ref: "User" },

    rejectedAt: { type: Date },
    rejectedBy: { type: mongoose.Types.ObjectId, ref: "User" },
    rejectionReason: { type: String },

    assignedUsername: { type: String },
    assignedPasswordHash: { type: String }, // hashed password
  },
  { timestamps: true }
);

// Prevent model overwrite errors during hot reload
const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema);
export default Payment;
