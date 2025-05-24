import express from 'express';
import { auth } from '../middleware/auth.js';
import { getUser, updateUser, deleteUser, updateAddress, updateMobile } from '../controllers/userController.js';

const router = express.Router();

router.get('/me', auth, getUser);
router.put('/me', auth, updateUser);
router.delete('/me', auth, deleteUser);
router.put('/me/address', auth, updateAddress);
router.put('/me/mobile', auth, updateMobile);

export default router;
