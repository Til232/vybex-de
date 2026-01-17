import express from 'express';
import { generateTryOn, generateTryOnFromUpload, getTryOnStatus } from '../controllers/tryOnController.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

/**
 * POST /api/try-on/generate
 * Generate virtual try-on from existing image paths
 * Body: { sourceImagePath, referenceImagePath, category }
 */
router.post('/generate', generateTryOn);

/**
 * POST /api/try-on/upload-and-generate
 * Generate virtual try-on from uploaded files
 * Files: modelImage, clothImage
 * Body: { category, steps, guidance, seed }
 */
router.post(
  '/upload-and-generate',
  upload.fields([
    { name: 'modelImage', maxCount: 1 },
    { name: 'clothImage', maxCount: 1 }
  ]),
  generateTryOnFromUpload
);

/**
 * GET /api/try-on/status/:taskId
 * Check status of a try-on task
 */
router.get('/status/:taskId', getTryOnStatus);

export default router;
