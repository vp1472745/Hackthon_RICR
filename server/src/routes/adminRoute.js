import express from "express";
import { adminLogin,  deleteAdmin ,adminLogout, getAllUsers} from "../controller/adminController.js";

const router = express.Router();

// Admin login route
router.post("/login", adminLogin);

// Delete admin route
router.delete("/:id", deleteAdmin);

// Logout admin
router.post("/logout", adminLogout);


// Get all users
router.get("/users",  getAllUsers);

export default router;