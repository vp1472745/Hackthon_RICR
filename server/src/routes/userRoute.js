import express from 'express';
import {
  getLeaderProfile,
  updateLeaderProfile,
  deleteLeaderProfile,
  addTeamMember,
  removeTeamMember,
  editTeamMemberByLeader,
  getMemberProfile
} from '../controller/userController.js';

const router = express.Router();

// ===================== General User Routes =====================

// Get user by ID (public route for now)
router.get('/:userId', async (req, res, next) => {
  try {
    const { userId } = req.params;
    const User = (await import('../models/UserModel.js')).default;
    
    const user = await User.findById(userId)
      .populate('teamId', 'teamName teamCode themeId createdAt');
    
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }
    
    // Get team members if user has a team
    let teamInfo = null;
    if (user.teamId) {
      const teamMembers = await User.find({ teamId: user.teamId })
        .select('fullName email phone role collegeName course collegeBranch collegeSemester GitHubProfile createdAt')
        .sort({ role: 1, createdAt: 1 });
      
      const leader = teamMembers.find(member => member.role === 'Leader');
      const members = teamMembers.filter(member => member.role === 'Member');
      
      teamInfo = {
        team: user.teamId,
        leader: leader || null,
        members: members || [],
        totalMembers: teamMembers.length,
        maxCapacity: 5,
        availableSlots: Math.max(0, 5 - teamMembers.length)
      };
    }
    
    res.status(200).json({
      message: 'User retrieved successfully',
      user: {
        ...user.toObject(),
        teamInfo: teamInfo
      }
    });
    
  } catch (error) {
    next(error);
  }
});

// ===================== Leader Routes =====================

// Get leader profile with complete team info
router.get('/leader/profile', getLeaderProfile);

// Update leader's own profile
router.put('/leader/profile', updateLeaderProfile);

// Delete leader's own profile
router.delete('/leader/profile', deleteLeaderProfile);

// ===================== Team Management Routes (Leader Only) =====================

// Add team member (leader only)
router.post('/leader/add-member', addTeamMember);

// Remove team member (leader only)
router.delete('/leader/remove-member', removeTeamMember);

// Edit team member profile (leader only)
router.put('/leader/edit-member/:memberId', editTeamMemberByLeader);

// ===================== Member Routes =====================

// Get member profile with team info
router.get('/member/profile', getMemberProfile);

export default router;
