import SegmindVTONService from '../services/segmindService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize service
const tryOnService = new SegmindVTONService();

export const generateTryOn = async (req, res) => {
  try {
    const { modelImagePath, clothImagePath, category = 'upper_body', steps, guidance, seed } = req.body;

    if (!modelImagePath || !clothImagePath) {
      return res.status(400).json({
        success: false,
        error: 'modelImagePath and clothImagePath are required'
      });
    }

    // Create output directory for try-on results
    const uploadsDir = path.join(__dirname, '../../uploads/try-ons');
    
    // Generate try-on
    const result = await tryOnService.generateTryOn(
      modelImagePath,
      clothImagePath,
      uploadsDir,
      { category, steps, guidance, seed }
    );

    res.json(result);
  } catch (error) {
    console.error('Try-on generation error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const generateTryOnFromUpload = async (req, res) => {
  try {
    if (!req.files || !req.files.modelImage || !req.files.clothImage) {
      return res.status(400).json({
        success: false,
        error: 'Both modelImage and clothImage files are required'
      });
    }

    const { category = 'upper_body', steps, guidance, seed } = req.body;
    const uploadsDir = path.join(__dirname, '../../uploads');
    const tempDir = path.join(uploadsDir, 'temp');
    const tryOnsDir = path.join(uploadsDir, 'try-ons');

    // Ensure temp directory exists
    await fs.ensureDir(tempDir);

    // Save uploaded files temporarily
    const modelFile = req.files.modelImage[0];
    const clothFile = req.files.clothImage[0];

    const modelImagePath = path.join(tempDir, `model-${Date.now()}.jpg`);
    const clothImagePath = path.join(tempDir, `cloth-${Date.now()}.jpg`);

    await fs.writeFile(modelImagePath, modelFile.buffer);
    await fs.writeFile(clothImagePath, clothFile.buffer);

    // Generate try-on
    const result = await tryOnService.generateTryOn(
      modelImagePath,
      clothImagePath,
      tryOnsDir,
      { category, steps, guidance, seed }
    );

    // Clean up temporary files
    await fs.remove(modelImagePath);
    await fs.remove(clothImagePath);

    res.json(result);
  } catch (error) {
    console.error('Try-on generation from upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const getTryOnStatus = async (req, res) => {
  try {
    const { taskId } = req.params;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        error: 'taskId is required'
      });
    }

    // For Segmind, we return immediately, so just acknowledge
    res.json({
      success: true,
      taskId,
      status: 'completed',
      message: 'Try-on completed'
    });
  } catch (error) {
    console.error('Try-on status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
