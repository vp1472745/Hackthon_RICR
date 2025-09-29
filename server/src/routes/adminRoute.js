import express from "express";
import { adminLogin, updateAdminRole, deleteAdmin } from "../controller/adminController.js";

const router = express.Router();

// Admin login route
router.post("/login", adminLogin);


// Update admin role route
router.put("/:id/role", updateAdminRole);

// Delete admin route
router.delete("/:id", deleteAdmin);

export default router;