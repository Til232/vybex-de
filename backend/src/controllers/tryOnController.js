import KlingAIVTONService from '../services/klingAiService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize service
const tryOnService = new KlingAIVTONService();

export const generateTryOn = async (req, res) => {
  try {
    const { sourceImagePath, referenceImagePath, category = 'upper_body' } = req.body;

    if (!sourceImagePath || !referenceImagePath) {
      return res.status(400).json({
        success: false,
        error: 'sourceImagePath and referenceImagePath are required'
      });
    }

    // Create output directory for try-on results
    const uploadsDir = path.join(__dirname, '../../uploads/try-ons');
    
    // Generate try-on
    const result = await tryOnService.generateTryOn(
      sourceImagePath,
      referenceImagePath,
      uploadsDir,
      { category }
    );

    res.json({
      success: true,
      taskId: result.taskId,
      images: result.images,
      totalImages: result.totalImages,
      message: `Successfully generated ${result.totalImages} try-on image(s)`
    });
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
    if (!req.files || !req.files.sourceImage || !req.files.referenceImage) {
      return res.status(400).json({
        success: false,
        error: 'Both sourceImage and referenceImage files are required'
      });
    }

    const { category = 'upper_body' } = req.body;
    const uploadsDir = path.join(__dirname, '../../uploads');
    const tempDir = path.join(uploadsDir, 'temp');
    const tryOnsDir = path.join(uploadsDir, 'try-ons');

    // Ensure temp directory exists
    await fs.ensureDir(tempDir);

    // Save uploaded files temporarily
    const sourceFile = req.files.sourceImage[0];
    const referenceFile = req.files.referenceImage[0];

    const sourceImagePath = path.join(tempDir, `source-${Date.now()}.jpg`);
    const referenceImagePath = path.join(tempDir, `reference-${Date.now()}.jpg`);

    await fs.writeFile(sourceImagePath, sourceFile.buffer);
    await fs.writeFile(referenceImagePath, referenceFile.buffer);

    // Generate try-on
    const result = await tryOnService.generateTryOn(
      sourceImagePath,
      referenceImagePath,
      tryOnsDir,
      { category }
    );

    // Clean up temporary files
    await fs.remove(sourceImagePath);
    await fs.remove(referenceImagePath);

    res.json({
      success: true,
      taskId: result.taskId,
      images: result.images,
      totalImages: result.totalImages,
      message: `Successfully generated ${result.totalImages} try-on image(s)`
    });
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

    // Poll status
    const result = await tryOnService.pollTaskUntilComplete(taskId);

    res.json({
      success: true,
      taskId,
      status: result.status,
      images: result.images
    });
  } catch (error) {
    console.error('Try-on status check error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
