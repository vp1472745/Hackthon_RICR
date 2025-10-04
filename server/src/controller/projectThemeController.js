import Team from "../models/TeamModel.js";

import Theme from '../models/projectTheme.js';

import ProblemStatement from '../models/problemStatementModel.js';



// Controller for selecting a theme for a team
export const selectThemeForTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { themeName } = req.body;

    const theme = await Theme.findOne({ themeName });
    if (!theme) {
      return res.status(404).json({ message: 'Theme not found' });
    }

    // कोई एक ProblemStatement उस theme का उठा लो
    const problemStatement = await ProblemStatement.findOne({ PSTheme: theme._id });

    console.log('🎯 Theme Selection Debug:', {
      teamId,
      themeName,
      themeId: theme._id,
      problemStatementId: problemStatement?._id
    });

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        teamTheme: theme._id,  // Correct field name from TeamModel
        teamProblemStatement: problemStatement?._id || null
      },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }

    console.log('✅ Team Updated Successfully:', {
      teamId: updatedTeam._id,
      teamTheme: updatedTeam.teamTheme,
      teamProblemStatement: updatedTeam.teamProblemStatement
    });

    res.status(200).json({ message: 'Theme selected successfully', team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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



