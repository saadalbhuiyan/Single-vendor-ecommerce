const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUserToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/me', verifyUserToken, userController.getProfile);
router.put('/me', verifyUserToken, userController.updateProfile);
router.delete('/me', verifyUserToken, userController.deleteAccount);

router.put('/me/address', verifyUserToken, userController.updateAddress);
router.put('/me/mobile', verifyUserToken, userController.updateMobile);
router.post('/me/avatar', verifyUserToken, upload.single('avatar'), userController.uploadAvatar);

router.post('/me/verify-email-change', verifyUserToken, userController.verifyEmailChange);

module.exports = router;
