
import express from "express";
import { selectThemeForTeam, getAllThemes } from "../controller/projectThemeController.js";


const router = express.Router();


// User selects a theme for their team
router.put("/select/:teamId", selectThemeForTeam);

// Get all themes
router.get("/", getAllThemes);





export default router;
