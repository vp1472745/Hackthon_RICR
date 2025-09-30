import Team from "../models/TeamModel.js";

import Theme from '../models/projectTheme.js';

import ProblemStatement from '../models/problemStatementModel.js';


// Controller for selecting a theme for a team
export const selectThemeForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { themeName } = req.body;
    // Find the theme by name
    const theme = await Theme.findOne({ themeName });
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    const problemStatements = await ProblemStatement.findOne({ PSTheme: theme._id });
    // Update the team with the theme's ObjectId
    const updatedTeam = await Team.findByIdAndUpdate(teamId, {
      teamTheme: theme._id,
      teamProblemStatement: problemStatements._id
    }, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.status(200).json({ message: 'Theme selected successfully', team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
// Create a new theme
export const createTheme = async (req, res) => {
  try {
    const { themeName, themeDescription } = req.body;
    if (!themeName || !themeDescription) {
      return res.status(400).json({ message: "Theme name and description are required." });
    }
    const theme = new Theme({ themeName, themeDescription });
    await theme.save();
    res.status(201).json({ message: "Theme created successfully", theme });
  } catch (error) {
    res.status(500).json({ message: "Failed to create theme", error: error.message });
  }
};

// Get all themes
export const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    res.status(200).json({ themes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch themes", error: error.message });
  }
};



