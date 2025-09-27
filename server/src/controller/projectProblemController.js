// src/controller/projectProblemController.js
import mongoose from 'mongoose';
import ProblemStatement from '../models/problemStatementModel.js';
import Team from '../models/TeamModel.js';

// Create a new problem statement
export const createProblemStatement = async (req, res) => {
  try {
    const { PStitle, PSdescription, PSTheme } = req.body;

    if (!PSTheme || !mongoose.Types.ObjectId.isValid(String(PSTheme))) {
      return res.status(400).json({ success: false, message: 'PSTheme must be a valid Theme ObjectId' });
    }

    const newProblem = await ProblemStatement.create({ PStitle, PSdescription, PSTheme: mongoose.Types.ObjectId(PSTheme) });
    await newProblem.populate('PSTheme');
    res.status(201).json({ success: true, problem: newProblem });
  } catch (error) {
    console.error('createProblemStatement error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all problem statements for a team's theme
export const getAllProblemStatements = async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log('getAllProblemStatements teamId:', teamId);

    if (!mongoose.Types.ObjectId.isValid(String(teamId))) {
      console.log('Invalid teamId format');
      return res.status(400).json({ success: false, message: 'Invalid teamId' });
    }

    const team = await Team.findById(teamId).select('teamTheme').lean();
    console.log('team doc:', team);

    if (!team) return res.status(404).json({ success: false, message: 'Team not found' });

    const teamTheme = team.teamTheme;
    console.log('team.teamTheme raw:', teamTheme);

    // ✅ Directly use teamTheme (already ObjectId) in query
    const problemStatements = await ProblemStatement.find({ PSTheme: teamTheme })
      .populate('PSTheme')
      .lean();

    console.log('problemStatements count:', problemStatements.length);

    return res.json({ success: true, problemStatements });
  } catch (error) {
    console.error('getAllProblemStatements error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
