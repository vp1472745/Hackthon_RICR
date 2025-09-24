import express from 'express';

const router = express.Router();
import { SendOTP, Register, Login, Logout } from '../controller/authController';


router.post("/sendOTP", SendOTP);
router.post('/register', Register);
router.post('/login', Login);
router.post('/logout', Logout);

export default router;