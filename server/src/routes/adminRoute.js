import express from "express";
import { adminLogin, deleteProblemStatement,editProblemStatement, deleteAdmin ,adminLogout, getAllUsers ,getAllThemes,createTheme ,editTheme ,deleteTheme, getAllTeams,  getAllProblemStatementsAdmin, createProblemStatement} from "../controller/adminController.js";

const router = express.Router();

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
router.put("/editTheme/:id", editTheme);


//delete theme route
router.delete("/deleteTheme/:id", deleteTheme);


// Create a new problem statement
router.post('/createProblemStatement', createProblemStatement);

// Get all problem statements for a team's theme
router.get('/problemStatements',  getAllProblemStatementsAdmin);


// edit problem statement route
router.put('/editProblemStatement/:id', editProblemStatement);   


// delete problem statement route
router.delete('/deleteProblemStatement/:id', deleteProblemStatement);

// Get all teams with their members
router.get('/teamsWithMembers',  getAllTeams);

// Get all users
router.get("/users",  getAllUsers);




export default router;