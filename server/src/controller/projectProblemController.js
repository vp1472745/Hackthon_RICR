// src/controller/projectProblemController.js
import mongoose from 'mongoose';
import ProblemStatement from '../models/problemStatementModel.js';
import Team from '../models/TeamModel.js';




// Get all problem statements for a team's theme
export const getAllProblemStatements = async (req, res) => {
  try {
    const { teamId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(String(teamId))) {
      return res.status(400).json({ success: false, message: 'Invalid teamId' });
    }

    const team = await Team.findById(teamId).select('teamTheme').lean();

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const teamTheme = team.teamTheme;

    // ✅ Directly use teamTheme (already ObjectId) in query
    const problemStatements = await ProblemStatement.find({ PSTheme: teamTheme })
      .populate('PSTheme')
      .lean();

    return res.json({ success: true, problemStatements });
  } catch (error) {
    console.error('getAllProblemStatements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};