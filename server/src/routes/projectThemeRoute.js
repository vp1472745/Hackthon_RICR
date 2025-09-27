import express from "express";
import {
	createTheme,
	selectThemeForTeam,
	getAllThemes
} from "../controller/projectThemeController.js";

const router = express.Router();


// User selects a theme for their team
router.put("/select/:teamId", selectThemeForTeam);

// Create a new theme
router.post("/", createTheme);


// Get all themes
router.get("/", getAllThemes);



export default router;
