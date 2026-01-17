import express from 'express';
import {
  addToWardrobe,
  getWardrobe,
  getWardrobeItem,
  updateWardrobeItem,
  deleteWardrobeItem,
  generateWardrobeTryOn,
  generateWardrobeTryOnFromUpload
} from '../controllers/wardrobeController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * POST /api/wardrobe/:userId/add
 * Add item to user's wardrobe
 * Body: { productId, color, size, notes }
 */
router.post('/:userId/add', addToWardrobe);

/**
 * GET /api/wardrobe/:userId
 * Get all items in user's wardrobe
 */
router.get('/:userId', getWardrobe);

/**
 * GET /api/wardrobe/item/:itemId
 * Get single wardrobe item details
 */
router.get('/item/:itemId', getWardrobeItem);

/**
 * PUT /api/wardrobe/item/:itemId
 * Update wardrobe item (notes, color, size, tryOnImage)
 */
router.put('/item/:itemId', updateWardrobeItem);

/**
 * DELETE /api/wardrobe/item/:itemId
 * Remove item from wardrobe
 */
router.delete('/item/:itemId', deleteWardrobeItem);

/**
 * POST /api/wardrobe/:itemId/try-on
 * Generate try-on for wardrobe item from file path
 * Body: { selfieImagePath }
 */
router.post('/:itemId/try-on', generateWardrobeTryOn);

/**
 * POST /api/wardrobe/:itemId/try-on-upload
 * Generate try-on for wardrobe item from uploaded selfie
 * Files: selfie
 */
router.post(
  '/:itemId/try-on-upload',
  upload.single('selfie'),
  generateWardrobeTryOnFromUpload
);

export default router;
