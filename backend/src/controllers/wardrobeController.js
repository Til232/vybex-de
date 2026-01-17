import Wardrobe from '../models/Wardrobe.js';
import Product from '../models/Product.js';
import SegmindVTONService from '../services/segmindService.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tryOnService = new SegmindVTONService();

/**
 * Add item to user's wardrobe
 */
export const addToWardrobe = async (req, res) => {
  try {
    const { userId, productId, color, size, notes } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        error: 'userId and productId are required'
      });
    }

    // Get product to verify it exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Get primary product image
    const images = await Product.getImages(productId);
    const primaryImage = images.find(img => img.is_primary) || images[0];

    const wardrobeItem = await Wardrobe.create({
      userId,
      productId,
      imageUrl: primaryImage?.image_url,
      color,
      size,
      notes
    });

    res.status(201).json({
      success: true,
      data: wardrobeItem,
      message: 'Item added to wardrobe'
    });
  } catch (error) {
    console.error('Add to wardrobe error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get user's wardrobe
 */
export const getWardrobe = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const items = await Wardrobe.findByUserId(userId);
    const count = await Wardrobe.getCount(userId);

    res.json({
      success: true,
      data: items,
      count,
      message: `User wardrobe contains ${count} items`
    });
  } catch (error) {
    console.error('Get wardrobe error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Get single wardrobe item
 */
export const getWardrobeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await Wardrobe.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Wardrobe item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get wardrobe item error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Update wardrobe item
 */
export const updateWardrobeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { tryOnImageUrl, notes, color, size } = req.body;

    const item = await Wardrobe.update(itemId, {
      tryOnImageUrl,
      notes,
      color,
      size
    });

    res.json({
      success: true,
      data: item,
      message: 'Wardrobe item updated'
    });
  } catch (error) {
    console.error('Update wardrobe item error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Delete wardrobe item
 */
export const deleteWardrobeItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await Wardrobe.delete(itemId);

    res.json({
      success: true,
      message: 'Wardrobe item deleted'
    });
  } catch (error) {
    console.error('Delete wardrobe item error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Generate try-on for wardrobe item
 */
export const generateWardrobeTryOn = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { selfieImagePath } = req.body;

    if (!selfieImagePath) {
      return res.status(400).json({
        success: false,
        error: 'selfieImagePath is required'
      });
    }

    // Get wardrobe item
    const item = await Wardrobe.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Wardrobe item not found'
      });
    }

    // Validate selfie path exists
    await fs.access(selfieImagePath);

    // Get product image
    const product = await Product.findById(item.product_id);
    const images = await Product.getImages(item.product_id);
    const productImage = images[0];

    if (!productImage) {
      return res.status(400).json({
        success: false,
        error: 'Product image not found'
      });
    }

    // Generate try-on
    const uploadsDir = path.join(__dirname, '../../uploads/try-ons');
    const result = await tryOnService.generateTryOn(
      selfieImagePath,
      productImage.image_url,
      uploadsDir,
      { category: product.category || 'upper_body' }
    );

    // Update wardrobe item with try-on image
    await Wardrobe.update(itemId, {
      tryOnImageUrl: `/uploads/try-ons/${result.image.filename}`
    });

    res.json({
      success: true,
      tryOnImage: result.image,
      message: 'Try-on generated successfully'
    });
  } catch (error) {
    console.error('Generate wardrobe try-on error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

/**
 * Generate try-on from wardrobe with uploaded selfie
 */
export const generateWardrobeTryOnFromUpload = async (req, res) => {
  try {
    const { itemId } = req.params;

    if (!req.files || !req.files.selfie) {
      return res.status(400).json({
        success: false,
        error: 'selfie file is required'
      });
    }

    // Get wardrobe item
    const item = await Wardrobe.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        error: 'Wardrobe item not found'
      });
    }

    // Save selfie temporarily
    const uploadsDir = path.join(__dirname, '../../uploads');
    const tempDir = path.join(uploadsDir, 'temp');
    await fs.ensureDir(tempDir);

    const selfieFile = req.files.selfie[0];
    const selfiePath = path.join(tempDir, `selfie-${Date.now()}.jpg`);
    await fs.writeFile(selfiePath, selfieFile.buffer);

    // Get product image
    const product = await Product.findById(item.product_id);
    const images = await Product.getImages(item.product_id);
    const productImage = images[0];

    if (!productImage) {
      await fs.remove(selfiePath);
      return res.status(400).json({
        success: false,
        error: 'Product image not found'
      });
    }

    // Generate try-on
    const tryOnsDir = path.join(uploadsDir, 'try-ons');
    const result = await tryOnService.generateTryOn(
      selfiePath,
      productImage.image_url,
      tryOnsDir,
      { category: product.category || 'upper_body' }
    );

    // Update wardrobe item with try-on image
    await Wardrobe.update(itemId, {
      tryOnImageUrl: `/uploads/try-ons/${result.image.filename}`
    });

    // Clean up temp file
    await fs.remove(selfiePath);

    res.json({
      success: true,
      tryOnImage: result.image,
      message: 'Try-on generated successfully'
    });
  } catch (error) {
    console.error('Generate wardrobe try-on from upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
