import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class SegmindVTONService {
  constructor() {
    this.apiKey = process.env.SEGMIND_API_KEY;
    this.baseUrl = 'https://api.segmind.com/v1/tryon-diffusion';
    
    if (!this.apiKey || this.apiKey === 'placeholder_key_replace_later') {
      console.warn('⚠️  SEGMIND_API_KEY not configured. Virtual try-on features will be disabled.');
    }
  }

  /**
   * Read image file and convert to base64
   */
  async readImageAsBase64(imagePath) {
    try {
      const imageBuffer = await fs.readFile(imagePath);
      return imageBuffer.toString('base64');
    } catch (error) {
      throw new Error(`Failed to read image file: ${imagePath}. Error: ${error.message}`);
    }
  }

  /**
   * Get image MIME type from file path
   */
  getImageMimeType(imagePath) {
    const ext = path.extname(imagePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Map category names to Segmind format
   */
  mapCategory(category) {
    const categoryMap = {
      'upper_body': 'Upper body',
      'upper body': 'Upper body',
      'lower_body': 'Lower body',
      'lower body': 'Lower body',
      'dress': 'Dress',
      'full_body': 'Dress'
    };
    return categoryMap[category?.toLowerCase()] || 'Upper body';
  }

  /**
   * Generate virtual try-on using Segmind API
   */
  async generateTryOn(modelImagePath, clothImagePath, outputDir, options = {}) {
    try {
      // Validate input files exist
      await fs.access(modelImagePath);
      await fs.access(clothImagePath);

      // Read images as base64
      const modelBase64 = await this.readImageAsBase64(modelImagePath);
      const clothBase64 = await this.readImageAsBase64(clothImagePath);

      // Prepare request payload
      const payload = {
        model_image: modelBase64,
        cloth_image: clothBase64,
        category: this.mapCategory(options.category || 'upper_body'),
        num_inference_steps: options.steps || 25,
        guidance_scale: options.guidance || 2.5,
        seed: options.seed || -1
      };

      // Make API request
      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      });

      // Save the result image
      await fs.ensureDir(outputDir);
      const filename = `try-on-${Date.now()}.jpg`;
      const outputPath = path.join(outputDir, filename);
      
      await fs.writeFile(outputPath, response.data);

      return {
        success: true,
        image: {
          filename,
          path: outputPath,
          size: response.data.length,
          createdAt: new Date().toISOString()
        },
        message: 'Try-on generated successfully'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Virtual try-on generation failed: ${errorMessage}`);
    }
  }
}

export default SegmindVTONService;
