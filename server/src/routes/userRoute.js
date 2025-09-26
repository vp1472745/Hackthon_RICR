import express from 'express';
import {
  getUserById,
  getLeaderProfile,
  updateLeaderProfile,
  deleteLeaderProfile,
  addTeamMember,
  removeTeamMember,
  editTeamMemberByLeader,
  getMemberProfile,
  updateTermsAccepted

} from '../controller/userController.js';
import { authenticateToken, authenticateLeader } from '../middlewares/auth.js';

const router = express.Router();

// ===================== General User Routes =====================

// Get user by ID (public route for now)
router.get('/:userId', getUserById);

// ===================== Leader Routes =====================

// Get leader profile with complete team info
router.get('/leader/profile', authenticateLeader, getLeaderProfile);

// Update leader's own profile
router.put('/leader/profile', authenticateLeader, updateLeaderProfile);

// Delete leader's own profile
router.delete('/leader/profile', authenticateLeader, deleteLeaderProfile);

// Update terms acceptance
router.put('/update-terms', authenticateToken, updateTermsAccepted);

// ===================== Team Management Routes (Leader Only) =====================

// Add team member (leader only)
router.post('/leader/add-member', authenticateLeader, addTeamMember);

// Remove team member (leader only)
router.delete('/leader/remove-member', authenticateLeader, removeTeamMember);

// Edit team member profile (leader only)
router.put('/leader/edit-member/:memberId', authenticateLeader, editTeamMemberByLeader);

// ===================== Member Routes =====================

// Get member profile with team info
router.get('/member/profile', authenticateToken, getMemberProfile);

export default router;
