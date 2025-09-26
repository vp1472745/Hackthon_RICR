import express from 'express';
import { getTeamTheme } from '../controller/teamController.js';

const router = express.Router();

// GET /api/team/:teamId - returns only teamTheme
router.get('/:teamId', getTeamTheme);

export default router;
