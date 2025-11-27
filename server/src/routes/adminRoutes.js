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
	getAllAdmins,
	  getResultsWithTeamAndLeader,
	    exportResultsExcel,
			createResult,
			updateResult,
			deleteResult,
			deleteAllResults,
			importResultsExcel,
			declareResults,
			getAllPayments,
			getPaymentById,
			verifyPayment

} from '../controller/adminController.js';
import multer from 'multer';
import { requireAdminPermission } from '../middlewares/requireAdminPermission.js';
import { authenticateAdmin } from '../middlewares/auth.js';
const upload = multer({ storage: multer.memoryStorage() }); // use memory for Excel parsing

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





//Result routes
router.get('/all-with-team-leader',authenticateAdmin, getResultsWithTeamAndLeader);
router.get('/export-excel', authenticateAdmin, exportResultsExcel);
router.post('/', authenticateAdmin, createResult);
router.put('/:id', authenticateAdmin, updateResult);
router.delete('/:id', authenticateAdmin, deleteResult);
router.delete('/all/delete-all', authenticateAdmin, deleteAllResults);
router.post('/import-excel', authenticateAdmin, upload.single('file'), importResultsExcel);
router.patch('/declare-results', authenticateAdmin,	 declareResults);

router.get('/payments', requireAdminPermission('seePaymentStats'), getAllPayments);
router.get('/payment/:id', requireAdminPermission('viewPaymentDetails'), getPaymentById);
// Review modal permission (for opening review UI, not backend logic)
router.post('/reviewPayment/:id', requireAdminPermission('reviewPayments'), (req, res) => {
	// This is a placeholder. You can add review logic here if needed.
	res.status(200).json({ message: 'Review permission granted.' });
});
// Verify payment
router.post('/verifyPayment/:id', requireAdminPermission('verifyPayments'), verifyPayment);

export default router;
