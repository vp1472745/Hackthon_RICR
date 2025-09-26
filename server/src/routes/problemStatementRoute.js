import express from 'express';
import {
	createProblemStatement,
	editProblemStatement,
	deleteProblemStatement,
	getAllProblemStatements
} from '../controller/projectProblemController.js';

const router = express.Router();

// Create a new problem statement
router.post('/', createProblemStatement);

// Edit a problem statement
router.put('/:id', editProblemStatement);

// Delete a problem statement
router.delete('/:id', deleteProblemStatement);

// Get all problem statements for a team's theme
router.get('/team/:teamId', getAllProblemStatements);

export default router;
