
import Team from '../models/TeamModel.js';
import Theme from '../models/projectTheme.js';
import User from '../models/UserModel.js';




// Get all themes
export const getAllThemes = async (req, res) => {
    try {
        const themes = await Theme.find().sort({ createdAt: -1 });
        
        // For each theme, count how many teams have selected it and get their info
        const teams = await Team.find({ teamTheme: { $ne: null } }).select('_id teamName teamCode teamTheme createdAt');
        
        // Get all leaders for these teams
        const teamIds = teams.map(team => team._id);
        const leaders = await User.find({ 
            teamId: { $in: teamIds }, 
            role: 'Leader' 
        }).select('teamId fullName');
        
        // Create leader map
        const leaderMap = {};
        leaders.forEach(leader => {
            leaderMap[leader.teamId.toString()] = leader.fullName;
        });
        
        // Get member counts for each team
        const memberCounts = await User.aggregate([
            { $match: { teamId: { $in: teamIds } } },
            { $group: { _id: '$teamId', memberCount: { $sum: 1 } } }
        ]);
        
        const memberCountMap = {};
        memberCounts.forEach(count => {
            memberCountMap[count._id.toString()] = count.memberCount;
        });
        
        // Map theme _id to array of teams with detailed info
        const teamMap = {};
        teams.forEach(team => {
            const themeId = team.teamTheme?.toString();
            if (!themeId) return;
            if (!teamMap[themeId]) teamMap[themeId] = [];
            teamMap[themeId].push({ 
                _id: team._id, 
                teamName: team.teamName, 
                teamCode: team.teamCode,
                leaderName: leaderMap[team._id.toString()] || 'Unknown',
                memberCount: memberCountMap[team._id.toString()] || 0,
                registrationDate: team.createdAt
            });
        });
        
        // Attach count and teams to each theme
        const themesWithTeams = themes.map(theme => {
            const enrolledTeams = teamMap[theme._id.toString()] || [];
            return {
                ...theme.toObject(),
                teamCount: enrolledTeams.length,
                enrolledTeams
            };
        });
        
        res.status(200).json({ themes: themesWithTeams });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch themes", error: error.message });
    }
};
