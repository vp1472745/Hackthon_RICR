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
