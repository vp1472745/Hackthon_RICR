import express from 'express';
import { addMemberToTeam } from '../controller/userController.js';

const router = express.Router();

router.post('/add-member', addMemberToTeam);

export default router;