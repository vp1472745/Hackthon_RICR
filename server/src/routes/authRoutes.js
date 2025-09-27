import express from 'express';

const router = express.Router();
import { SendOTP, Register, Login, Logout, SendCredentials } from '../controller/authController.js';


router.post("/sendOTP", SendOTP);
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);
router.post('/sendCredentials', SendCredentials);

export default router;