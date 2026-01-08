import express from 'express';
import { productController } from '../controllers/productController.js';
import { uploadMultiple } from '../middleware/upload.js';

const router = express.Router();

// Create product (with multiple image uploads)
router.post('/', uploadMultiple('images', 10), productController.createProduct);

// Get products by brand
router.get('/brand/:brand_id', productController.getProductsByBrand);

// Get single product
router.get('/:id', productController.getProduct);

// Update product (with optional image uploads)
router.put('/:id', uploadMultiple('images', 10), productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

export default router;
