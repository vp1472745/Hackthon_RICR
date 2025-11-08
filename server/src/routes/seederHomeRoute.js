import express from "express";
import { getHomeSeeder } from "../controller/seedHomeController.js";

const router = express.Router();

// Route to fetch HomeSeeder data
router.get("/homeseeder", getHomeSeeder);

export default router;