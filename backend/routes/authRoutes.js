import express from 'express';
import { sendOTP, verifyOTP, logout } from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/logout', logout);

export default router;
