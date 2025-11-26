import express from "express";

const router = express.Router();
import {
  SendOTP,
  Register,
  Login,
  Logout,
  SendCredentials,
  refreshData,
  submitPayment,
  getAllPayments,
  getPaymentById,

} from "../controller/authController.js";
import { authenticateLeader } from "../middlewares/auth.js";
import { uploadPaymentScreenshot } from "../utils/multer.js";

router.post("/sendOTP", SendOTP);
router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/sendCredentials", SendCredentials);
router.get("/refresh", authenticateLeader, refreshData);
router.post(
  "/submit",
  uploadPaymentScreenshot.single("screenshot"),
  submitPayment
);
router.get("/payments", getAllPayments);
router.get("/payment/:id",  getPaymentById);
export default router;
