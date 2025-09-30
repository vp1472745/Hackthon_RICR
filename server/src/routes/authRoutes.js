import express from 'express';

const router = express.Router();
import { SendOTP, Register, Login, Logout, SendCredentials, refreshData } from '../controller/authController.js';
import { authenticateLeader } from '../middlewares/auth.js';


router.post("/sendOTP", SendOTP);
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/sendCredentials', SendCredentials);
router.get('/refresh', authenticateLeader, refreshData);

export default router;