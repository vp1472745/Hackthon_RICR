import express from 'express';
import {
  getUserById,
  addTeamMember,
  removeTeamMember,
  editTeamMemberByLeader,
  updateTermsAccepted,
  getResult,
  getLeaderProfile

} from '../controller/userController.js';


import { authenticateLeader, authenticateToken } from '../middlewares/auth.js';

const router = express.Router();

// Get results for user's team (must be before /:userId route) - accessible by both leaders and members
router.get('/result', authenticateToken, getResult);

// Get user by ID (public route for now)
router.get('/:userId', getUserById);

// Add team member (leader only)
router.post('/leader/add-member', authenticateLeader, addTeamMember);

// Remove team member (leader only)
router.delete('/leader/remove-member', authenticateLeader, removeTeamMember);

// Edit team member profile (leader only)
router.put('/leader/edit-member/:memberId', authenticateLeader, editTeamMemberByLeader);

// Update terms acceptance (user only)
router.put('/update-terms', authenticateLeader, updateTermsAccepted);

// Get leader profile with team members
router.get('/leader/profile', authenticateLeader, getLeaderProfile);

export default router;
