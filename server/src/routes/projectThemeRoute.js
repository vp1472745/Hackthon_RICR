
import express from "express";
import { 
  selectThemeForTeam, 
  getAllThemes, 
  getAllThemesAdmin,
  activateAllThemes, 
  deactivateAllThemes 
} from "../controller/projectThemeController.js";


const router = express.Router();


// User selects a theme for their team
router.put("/select/:teamId", selectThemeForTeam);

// Get all active themes (for users)
router.get("/", getAllThemes);

// Get all themes for admin (active + inactive)
router.get("/admin/all", getAllThemesAdmin);

// Activate all themes (SuperAdmin)
router.patch("/activate-all", activateAllThemes);

// Deactivate all themes (SuperAdmin)
router.patch("/deactivate-all", deactivateAllThemes);





export default router;
