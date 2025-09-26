import ProblemStatement from '../models/problemStatementModel.js';
import Team from '../models/TeamModel.js';
// Create a new problem statement
export const createProblemStatement = async (req, res) => {
	try {
		const { PStitle, PSdescription, PSTheme } = req.body;
		const newProblem = await ProblemStatement.create({ PStitle, PSdescription, PSTheme });
		res.status(201).json({ success: true, problem: newProblem });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Edit (update) a problem statement
export const editProblemStatement = async (req, res) => {
	try {
		const { id } = req.params;
		const { PStitle, PSdescription, PSTheme } = req.body;
		const updated = await ProblemStatement.findByIdAndUpdate(
			id,
			{ PStitle, PSdescription, PSTheme },
			{ new: true }
		);
		if (!updated) return res.status(404).json({ success: false, message: 'Problem statement not found' });
		res.json({ success: true, problem: updated });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Delete a problem statement
export const deleteProblemStatement = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await ProblemStatement.findByIdAndDelete(id);
		if (!deleted) return res.status(404).json({ success: false, message: 'Problem statement not found' });
		res.json({ success: true, message: 'Problem statement deleted' });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};

// Get all problem statements for a team's theme
export const getAllProblemStatements = async (req, res) => {
	try {
		const { teamId } = req.params;
		// Find the team and get its theme
		const team = await Team.findById(teamId);
		if (!team || !team.teamTheme) {
			return res.status(404).json({ success: false, message: 'Team or team theme not found' });
		}
		// Find all problem statements with the same theme
		const problemStatements = await ProblemStatement.find({ PSTheme: team.teamTheme });
		res.json({ success: true, problemStatements });
	} catch (error) {
		res.status(500).json({ success: false, message: error.message });
	}
};



