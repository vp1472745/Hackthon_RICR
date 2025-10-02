import mongoose from "mongoose";

const AdminotpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  phone: { type: String, required: true },
  emailOTP: { type: String, required: true },
  phoneOTP: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const Otp = mongoose.model("AdminOtp", AdminotpSchema);

export default Otp;
