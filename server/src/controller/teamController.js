import Team from '../models/TeamModel.js';

// GET /api/team/:teamId - returns only teamTheme
export const getTeamTheme = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    return res.status(200).json({ teamTheme: team.teamTheme });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllProblemStatements = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const team = await Team.findById(teamId).populate('teamTheme');

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const problemStatements = await ProblemStatement.find({ theme: team.teamTheme });

    res.status(200).json({ problemStatements });
  } catch (error) {
    console.error('Error fetching problem statements:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
