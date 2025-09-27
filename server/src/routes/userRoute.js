import express from 'express';
import {
  getUserById,
  addTeamMember,
  removeTeamMember,
  editTeamMemberByLeader,
} from '../controller/userController.js';
import {  authenticateLeader } from '../middlewares/auth.js';

const router = express.Router();


// Get user by ID (public route for now)
router.get('/:userId', getUserById);

// Add team member (leader only)
router.post('/leader/add-member', authenticateLeader, addTeamMember);

// Remove team member (leader only)
router.delete('/leader/remove-member', authenticateLeader, removeTeamMember);

// Edit team member profile (leader only)
router.put('/leader/edit-member/:memberId', authenticateLeader, editTeamMemberByLeader);

export default router;
