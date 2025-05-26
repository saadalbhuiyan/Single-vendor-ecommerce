const express = require('express');
const router = express.Router();
const adminUserController = require('../controllers/adminUserController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.get('/users', verifyAdminToken, adminUserController.getAllUsers);
router.get('/users/:id', verifyAdminToken, adminUserController.getUserById);
router.put('/users/:id', verifyAdminToken, adminUserController.updateUserStatus);
router.delete('/users/:id', verifyAdminToken, adminUserController.deleteUser);

module.exports = router;
