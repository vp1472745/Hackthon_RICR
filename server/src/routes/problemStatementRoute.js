import express from 'express';
import {
	getAllProblemStatements,
} from '../controller/projectProblemController.js';

const router = express.Router();


// Get all problem statements for a team's theme
router.get('/team/:teamId', getAllProblemStatements);




export default router;
