const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyAdminToken } = require('../middleware/authMiddleware');

router.post('/auth/login', adminController.adminLogin);
router.put('/credentials', verifyAdminToken, adminController.updateAdminCredentials);

module.exports = router;
