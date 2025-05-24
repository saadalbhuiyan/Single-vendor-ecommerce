import express from 'express';
import { adminLogin, adminLogout, updateAdminCredentials } from '../controllers/adminAuthController.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = express.Router();

router.post('/auth/login', adminLogin);
router.post('/auth/logout', adminAuth, adminLogout);
router.put('/credentials', adminAuth, updateAdminCredentials);

export default router;
