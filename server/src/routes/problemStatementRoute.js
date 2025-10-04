import express from "express";
import {
    activateAllProblemStatements,
    getProblemStatementsForTeam,
    teamSelectProblemStatement,
    deactivateAllProblemStatements
} from "../controller/projectProblemController.js";

const router = express.Router();

// Activate all problem statements (SuperAdmin)
router.patch("/activate-all", activateAllProblemStatements);

// Get active problem statements for a team
router.get("/team/:teamId/problemstatements", getProblemStatementsForTeam);

// Team selects a problem statement
router.post("/team/select-problem", teamSelectProblemStatement);

// Deactivate all problem statements (SuperAdmin)
router.patch("/deactivate-all", deactivateAllProblemStatements);

export default router;
