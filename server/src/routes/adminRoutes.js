import express from 'express';
import {
	setAdminPermissions,
	getAdminPermissions,
	createTheme,
	getAllThemes,
	editTheme,
	deleteTheme,
	createProblemStatement,
	getAllProblemStatementsAdmin,
	editProblemStatement,
	deleteProblemStatement,
	getAllTeams,
	getAllUsers,
	getAllAdmins
} from '../controller/adminController.js';
import { requireAdminPermission } from '../middlewares/requireAdminPermission.js';
import { authenticateAdmin } from '../middlewares/auth.js';

const router = express.Router();

// Admin permissions
router.put('/set-permissions/:email', setAdminPermissions);
router.get('/admin-permissions/:email', getAdminPermissions);

// Theme routes
router.post('/createTheme', requireAdminPermission('createTheme'), createTheme);
router.get('/themes', authenticateAdmin, getAllThemes);
router.put('/editTheme/:id', requireAdminPermission('editTheme'), editTheme);
router.delete('/deleteTheme/:id', requireAdminPermission('deleteTheme'), deleteTheme);

// Problem Statement routes
router.post('/createProblemStatement', requireAdminPermission('createProblemStatement'), createProblemStatement);
router.get('/problemStatements', authenticateAdmin, getAllProblemStatementsAdmin);
router.put('/editProblemStatement/:id', requireAdminPermission('editProblemStatement'), editProblemStatement);
router.delete('/deleteProblemStatement/:id', requireAdminPermission('deleteProblemStatement'), deleteProblemStatement);

// Teams and Users
router.get('/teamsWithMembers', authenticateAdmin, getAllTeams);
router.get('/users', authenticateAdmin, getAllUsers);

// Admins
router.get('/admins', getAllAdmins);

export default router;
