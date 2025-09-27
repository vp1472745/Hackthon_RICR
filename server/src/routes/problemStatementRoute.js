import express from 'express';
import {
	createProblemStatement,
	getAllProblemStatements,
} from '../controller/projectProblemController.js';

const router = express.Router();

// Create a new problem statement
router.post('/', createProblemStatement);

// Get all problem statements for a team's theme
router.get('/team/:teamId', getAllProblemStatements);




export default router;
