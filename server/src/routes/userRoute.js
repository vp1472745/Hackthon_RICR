import express from 'express';
import { addMember, getTeamMembers, removeMember } from '../controller/userController.js';

const router = express.Router();

// Team member management routes
router.post('/add-member', addMember);
router.get('/team/:teamId/members', getTeamMembers);
router.delete('/remove-member/:memberId', removeMember);

export default router;