
import express from "express";
import { registerAdmin, sendAdminOTP, verifyAdminOTP, adminLogin, deleteProblemStatement, editProblemStatement, deleteAdmin, adminLogout, getAllUsers, getAllThemes, createTheme, editTheme, deleteTheme, getAllTeams, getAllProblemStatementsAdmin, createProblemStatement } from "../controller/SuperadminController.js";

const router = express.Router();

// Two-step admin registration
router.post("/sendAdminOTP", sendAdminOTP);
router.post("/verifyAdminOTP", verifyAdminOTP);
// Register Route
router.post("/register", registerAdmin);

// Admin login route
router.post("/login", adminLogin);
// Logout admin
router.post("/logout", adminLogout);
// Delete admin route
router.delete("/:id", deleteAdmin);
// Create a new theme
router.post("/createTheme", createTheme);
//getAll themes 
router.get("/themes", getAllThemes);
//edit theme route
router.put('/editTheme/:id', editTheme);
// Delete theme route
router.delete('/deleteTheme/:id', deleteTheme);
// Get all teams with members
router.get("/teamsWithMembers", getAllTeams);
// Create problem statement route
router.post('/createProblemStatement', createProblemStatement);
// Get all problem statements (admin)
router.get('/problemStatements', getAllProblemStatementsAdmin);
// edit problem statement route
router.put('/editProblemStatement/:id', editProblemStatement);
// Delete problem statement route
router.delete('/deleteProblemStatement/:id', deleteProblemStatement);
// Delete theme route
router.delete('/deleteTheme/:id', deleteTheme);
// Get all users
router.get("/users", getAllUsers);
// Delete problem statement route
router.delete('/deleteProblemStatement/:id', deleteProblemStatement);




export default router;