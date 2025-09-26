import express from "express";
import {
	createTheme,
	getAllThemes,
	getThemeById,
	updateTheme,
	deleteTheme,
	selectThemeForTeam
} from "../controller/projectThemeController.js";

const router = express.Router();


// User selects a theme for their team
router.put("/select/:teamId", selectThemeForTeam);

// Create a new theme
router.post("/", createTheme);

// Get all themes
router.get("/", getAllThemes);

// Get a theme by ID
router.get("/:id", getThemeById);

// Update a theme
router.put("/:id", updateTheme);

// Delete a theme
router.delete("/:id", deleteTheme);

export default router;
