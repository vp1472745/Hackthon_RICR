// src/controller/projectProblemController.js
import mongoose from 'mongoose';
import ProblemStatement from '../models/problemStatementModel.js';
import Team from '../models/TeamModel.js';

// Activate all problem statements
export const activateAllProblemStatements = async (req, res, next) => {
  try {
    const result = await ProblemStatement.updateMany(
      {},           // all records
      { isActive: true } // set isActive = true
    );

    res.status(200).json({
      success: true,
      message: "All problem statements have been activated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// Deactivate all problem statements
export const deactivateAllProblemStatements = async (req, res, next) => {
  try {
    const result = await ProblemStatement.updateMany(
      {},           // all records
      { isActive: false } // set isActive = false
    );

    res.status(200).json({
      success: true,
      message: "All problem statements have been deactivated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// Get active problem statements filtered by team's selected theme
export const getProblemStatementsForTeam = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ success: false, message: "Invalid team ID" });
    }

    const team = await Team.findById(teamId).lean();
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });


    let rawTheme = team.selectedTheme ?? team.teamTheme ?? team.teamThemeId ?? null;
    if (!rawTheme) {
      return res.status(400).json({ success: false, message: "Please select a theme first before viewing problem statements" });
    }

    // Determine ObjectId safely
    let themeId;
    if (typeof rawTheme === "string") {
      if (!mongoose.Types.ObjectId.isValid(rawTheme)) {
        return res.status(400).json({ success: false, message: "Invalid theme ID" });
      }
      themeId = new mongoose.Types.ObjectId(rawTheme);
    } else if (rawTheme instanceof mongoose.Types.ObjectId) {
      themeId = rawTheme;
    } else if (typeof rawTheme === "object" && rawTheme._id) {
      themeId = new mongoose.Types.ObjectId(rawTheme._id);
    } else {
      return res.status(400).json({ success: false, message: "Invalid theme type" });
    }

    // Check if problem statements are currently active
    const activeProblemsCount = await ProblemStatement.countDocuments({
      isActive: true,
      PSTheme: themeId
    });

    // If problem statements are deactivated, only return selected one (if any)
    if (activeProblemsCount === 0) {
    
      // Check if team has already selected a problem statement
      if (team.teamProblemStatement) {
        const selectedProblem = await ProblemStatement.findById(team.teamProblemStatement).populate("PSTheme");
        if (selectedProblem) {
          return res.status(200).json({ 
            success: true, 
            problemStatements: [selectedProblem],
            isDeactivated: true,
            message: "Problem statements are currently deactivated. Showing your selected problem only."
          });
        }
      }
      
      // No selected problem and problems are deactivated
      return res.status(400).json({ 
        success: false, 
        message: "Problem statements are currently deactivated. Please contact admin.",
        isDeactivated: true 
      });
    }

    // Problem statements are active - return all active ones for selection
    const problemStatements = await ProblemStatement.find({
      isActive: true,
      PSTheme: themeId
    }).populate("PSTheme");

    return res.status(200).json({ 
      success: true, 
      problemStatements,
      isDeactivated: false 
    });
  } catch (error) {
    next(error);
  }
};

// Team selects a problem statement
export const teamSelectProblemStatement = async (req, res, next) => {
  try {
    const { teamId, problemStatementId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(problemStatementId)) {
      return res.status(400).json({ success: false, message: "Invalid IDs" });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ success: false, message: "Team not found" });

    const problemStatement = await ProblemStatement.findById(problemStatementId);
    if (!problemStatement) return res.status(404).json({ success: false, message: "Problem statement not found" });

    // Safely get the team's theme
    const teamTheme = team.selectedTheme ?? team.teamTheme ?? team.teamThemeId;
    if (!teamTheme) {
      return res.status(400).json({ success: false, message: "Team has no theme assigned" });
    }

    // Convert to ObjectId if needed
    const teamThemeId = typeof teamTheme === "string" ? new mongoose.Types.ObjectId(teamTheme) : teamTheme;

    // Compare ObjectIds
    if (!teamThemeId.equals(problemStatement.PSTheme)) {
      return res.status(400).json({ success: false, message: "Problem statement does not match team's theme" });
    }

    // Save selected ProblemStatement in both fields (backward compatible)
    team.selectedProblemStatement = problemStatementId;
    team.teamProblemStatement = problemStatementId;
    await team.save();

    res.status(200).json({ success: true, message: "Problem statement selected successfully" });
  } catch (error) {
    next(error);
  }
};
