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

    res.status(200).json({ message: 'Theme selected successfully', team: updatedTeam });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// Get all active themes (only show active themes to users)
export const getAllThemes = async (req, res) => {
  try {
    const themes = await Theme.find({ status: 'active' }).sort({ createdAt: -1 });
    res.status(200).json({ themes });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch themes", error: error.message });
  }
};

// Get all themes for admin (shows both active and inactive with team info)
export const getAllThemesAdmin = async (req, res) => {
  try {
    const themes = await Theme.find().sort({ createdAt: -1 });
    
    // For each theme, find teams that selected it
    const themesWithTeams = await Promise.all(
      themes.map(async (theme) => {
        const teams = await Team.find({ teamTheme: theme._id })
          .select('teamName teamCode _id')
          .lean();
        
        return {
          ...theme.toObject(),
          enrolledTeams: teams,
          teamCount: teams.length
        };
      })
    );
    
    res.status(200).json({ themes: themesWithTeams });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch themes", error: error.message });
  }
};

// Activate all themes
export const activateAllThemes = async (req, res) => {
  try {
    const result = await Theme.updateMany(
      {},           // all records
      { status: 'active' } // set status = active
    );

    res.status(200).json({
      success: true,
      message: "All themes have been activated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to activate themes", 
      error: error.message 
    });
  }
};

// Deactivate all themes
export const deactivateAllThemes = async (req, res) => {
  try {
    const result = await Theme.updateMany(
      {},           // all records
      { status: 'inactive' } // set status = inactive
    );

    res.status(200).json({
      success: true,
      message: "All themes have been deactivated",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Failed to deactivate themes", 
      error: error.message 
    });
  }
};



