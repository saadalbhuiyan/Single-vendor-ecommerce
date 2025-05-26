const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware.verifyAdminToken);

router.get('/', wishlistController.getAllWishlist);
router.delete('/:id', wishlistController.deleteWishlistItemByAdmin);

module.exports = router;
