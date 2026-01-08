import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class KlingAIVTONService {
  constructor() {
    this.apiKey = process.env.KLING_AI_API_KEY;
    this.secretKey = process.env.KLING_AI_SECRET_KEY;
    this.baseUrl = process.env.KLING_AI_BASE_URL || 'https://api-singapore.klingai.com';
    this.pollInterval = 2000; // 2 seconds between polls
    this.maxWaitTime = 300000; // 5 minutes max wait time
    
    if (!this.apiKey || !this.secretKey) {
      throw new Error('KLING_AI_API_KEY and KLING_AI_SECRET_KEY environment variables are required');
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
   * Submit virtual try-on task to Kling AI
   */
  async submitTryOnTask(sourceImageBase64, referenceImageBase64, options = {}) {
    const {
      model = 'kolors-virtual-try-on-v1-5',
      category = 'upper_body'
    } = options;

    const payload = {
      model,
      task_type: 'virtual_try_on',
      source_image: sourceImageBase64,
      reference_image: referenceImageBase64,
      category
    };

    try {
      const response = await axios.post(
        `${this.baseUrl}/v1/image/virtual-try-on`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'X-Secret-Key': this.secretKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.task_id) {
        throw new Error('No task_id returned from Kling AI API');
      }

      return {
        taskId: response.data.task_id,
        status: 'submitted'
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Failed to submit try-on task to Kling AI: ${errorMessage}`);
    }
  }

  /**
   * Poll task status until completion
   */
  async pollTaskUntilComplete(taskId) {
    const startTime = Date.now();
    let lastError = null;

    while (Date.now() - startTime < this.maxWaitTime) {
      try {
        const response = await axios.get(
          `${this.baseUrl}/v1/image/virtual-try-on/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'X-Secret-Key': this.secretKey
            }
          }
        );

        const { status, data } = response.data;

        if (status === 'completed') {
          if (!data || !data.result || !data.result.images || data.result.images.length === 0) {
            throw new Error('No result images returned from Kling AI');
          }
          return {
            status: 'completed',
            images: data.result.images
          };
        }

        if (status === 'failed') {
          throw new Error(data?.error || 'Task failed on Kling AI side');
        }

        // Task still processing, wait before polling again
        await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      } catch (error) {
        lastError = error;
        // Continue polling unless it's a definitive failure
        if (error.response?.status === 404) {
          throw new Error('Task not found on Kling AI');
        }
        await new Promise(resolve => setTimeout(resolve, this.pollInterval));
      }
    }

    throw new Error(`Task polling timeout. Last error: ${lastError?.message}`);
  }

  /**
   * Download image from URL and save locally
   */
  async downloadAndSaveImage(imageUrl, outputPath) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      await fs.ensureDir(path.dirname(outputPath));
      await fs.writeFile(outputPath, response.data);
      return outputPath;
    } catch (error) {
      throw new Error(`Failed to download image from ${imageUrl}: ${error.message}`);
    }
  }

  /**
   * Main function: Generate virtual try-on
   * Returns paths to saved try-on images
   */
  async generateTryOn(sourceImagePath, referenceImagePath, outputDir, options = {}) {
    try {
      // Validate input files exist
      await fs.access(sourceImagePath);
      await fs.access(referenceImagePath);

      // Read images as base64
      const sourceBase64 = await this.readImageAsBase64(sourceImagePath);
      const referenceBase64 = await this.readImageAsBase64(referenceImagePath);

      // Submit task
      const submission = await this.submitTryOnTask(sourceBase64, referenceBase64, options);

      // Poll until completion
      const result = await this.pollTaskUntilComplete(submission.taskId);

      // Download and save result images
      await fs.ensureDir(outputDir);
      const savedImages = [];

      for (let i = 0; i < result.images.length; i++) {
        const imageUrl = result.images[i];
        const filename = `try-on-result-${Date.now()}-${i}.jpg`;
        const outputPath = path.join(outputDir, filename);
        
        const savedPath = await this.downloadAndSaveImage(imageUrl, outputPath);
        savedImages.push({
          filename,
          path: savedPath,
          url: imageUrl
        });
      }

      return {
        success: true,
        taskId: submission.taskId,
        images: savedImages,
        totalImages: savedImages.length
      };
    } catch (error) {
      throw new Error(`Virtual try-on generation failed: ${error.message}`);
    }
  }
}

export default KlingAIVTONService;
