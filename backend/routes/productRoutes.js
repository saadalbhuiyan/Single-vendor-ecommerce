import express from 'express';
import { adminAuth } from '../middleware/adminAuth.js';
import {
    getProducts,
    searchProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadImages,
} from '../controllers/productController.js';

import { uploadProductImages } from '../utils/imageUpload.js';

const router = express.Router();

// User routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/:id', getProduct);

// Admin routes (protected by adminAuth)
router.post('/admin/products', adminAuth, createProduct);
router.put('/admin/products/:id', adminAuth, updateProduct);
router.delete('/admin/products/:id', adminAuth, deleteProduct);
router.post(
    '/admin/products/:id/images',
    adminAuth,
    uploadProductImages,
    uploadImages
);

export default router;
