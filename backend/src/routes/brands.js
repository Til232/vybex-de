import express from 'express';
import { brandController } from '../controllers/brandController.js';
import { uploadSingle } from '../middleware/upload.js';

const router = express.Router();

// Create brand (with logo upload)
router.post('/', uploadSingle('logo'), brandController.createBrand);

// Get all brands
router.get('/', brandController.getBrands);

// Get brand by slug
router.get('/:slug', brandController.getBrandBySlug);

// Update brand (with optional logo upload)
router.put('/:id', uploadSingle('logo'), brandController.updateBrand);

// Delete brand
router.delete('/:id', brandController.deleteBrand);

export default router;
