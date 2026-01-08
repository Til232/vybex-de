# Kling AI Virtual Try-On Integration

This guide explains how to set up and use Kling AI's virtual try-on API with VYBEX.

## Overview

Kling AI provides state-of-the-art virtual try-on capabilities through their **Kolors** API. This integration allows customers to see products on themselves before purchasing.

**Key Features:**
- High-quality virtual try-on generation
- Multiple garment categories (upper body, lower body, dresses)
- Asynchronous processing with polling
- Fast results (typically 30-60 seconds)
- Affordable pricing with generous free tier

## Setup Instructions

### 1. Get Kling AI API Credentials

1. Visit: https://app.klingai.com/
2. Sign up for a free account
3. Navigate to Developer Portal → API Keys
4. Copy your **API Key** (access_key) and **Secret Key** (secret_key)

### 2. Configure Environment Variables

Create or update your `.env` file in the `backend/` directory:

```bash
# Kling AI Virtual Try-On
KLING_AI_API_KEY=your_api_key_here
KLING_AI_SECRET_KEY=your_secret_key_here
KLING_AI_BASE_URL=https://api-singapore.klingai.com
```

**Note:** You can use different regional endpoints:
- `https://api-singapore.klingai.com` (Singapore - Recommended)
- Other regions available in Kling AI docs

### 3. Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `axios` - HTTP client for API calls
- `sharp` - Image processing (optional, for optimization)

### 4. Start the Backend

```bash
npm run dev
```

The server will start on `http://localhost:5001`

## API Endpoints

### 1. Generate Try-On (Upload Files)

**Endpoint:** `POST /api/try-on/upload-and-generate`

Upload person and garment images and get try-on results.

**Request:**
```bash
curl -X POST http://localhost:5001/api/try-on/upload-and-generate \
  -F "sourceImage=@person.jpg" \
  -F "referenceImage=@garment.jpg" \
  -F "category=upper_body"
```

**Parameters:**
- `sourceImage` (file) - Image of person/model wearing base outfit
- `referenceImage` (file) - Image of garment to try on
- `category` (string, optional) - Garment category:
  - `upper_body` - Shirts, tops, jackets, hoodies (default)
  - `lower_body` - Pants, jeans, skirts, shorts
  - `dress` - Full dresses, jumpsuits

**Response:**
```json
{
  "success": true,
  "taskId": "task-uuid-1234",
  "images": [
    {
      "filename": "try-on-result-1704067200000-0.jpg",
      "path": "/Users/.../uploads/try-ons/try-on-result-1704067200000-0.jpg",
      "url": "https://kling-cdn-url.com/image.jpg"
    }
  ],
  "totalImages": 1,
  "message": "Successfully generated 1 try-on image(s)"
}
```

### 2. Check Task Status

**Endpoint:** `GET /api/try-on/status/:taskId`

Check the status of a try-on generation task.

**Request:**
```bash
curl -X GET http://localhost:5001/api/try-on/status/task-uuid-1234
```

**Response:**
```json
{
  "success": true,
  "taskId": "task-uuid-1234",
  "status": "completed",
  "images": ["https://kling-cdn-url.com/image1.jpg"]
}
```

### 3. Generate Try-On (From Existing Paths)

**Endpoint:** `POST /api/try-on/generate`

Generate try-on using existing image file paths.

**Request:**
```json
POST /api/try-on/generate
{
  "sourceImagePath": "/path/to/person.jpg",
  "referenceImagePath": "/path/to/garment.jpg",
  "category": "upper_body"
}
```

## Implementation Examples

### React Frontend Example

```javascript
async function generateTryOn(sourceImage, referenceImage) {
  const formData = new FormData();
  formData.append('sourceImage', sourceImage); // File object
  formData.append('referenceImage', referenceImage); // File object
  formData.append('category', 'upper_body');

  try {
    const response = await fetch(
      'http://localhost:5001/api/try-on/upload-and-generate',
      {
        method: 'POST',
        body: formData
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log('Try-on generated:', result.images);
      return result.images;
    } else {
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}
```

### Node.js Backend Example

```javascript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function generateTryOn(personImagePath, garmentImagePath) {
  const formData = new FormData();
  formData.append('sourceImage', fs.createReadStream(personImagePath));
  formData.append('referenceImage', fs.createReadStream(garmentImagePath));
  formData.append('category', 'upper_body');

  try {
    const response = await axios.post(
      'http://localhost:5001/api/try-on/upload-and-generate',
      formData,
      { headers: formData.getHeaders() }
    );

    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}
```

## Garment Categories Explained

### Upper Body
- T-shirts, polos, shirts
- Sweaters, hoodies
- Jackets, blazers
- Vests, tank tops

### Lower Body
- Jeans, pants, chinos
- Skirts, shorts
- Leggings, athletic wear

### Dress
- Full dresses
- Jumpsuits
- Overalls
- Long gowns

## Performance & Limits

| Metric | Value |
|--------|-------|
| Average response time | 30-60 seconds |
| Max image size | 16M pixels (4096x4096) |
| Supported formats | JPG, PNG |
| Concurrent requests | 10+ |
| Free tier credits | Generous |

## Pricing

Kling AI offers:
- **Free tier** - Good for testing and development
- **Pay-as-you-go** - Affordable per-image pricing
- **Enterprise** - Volume discounts available

Check pricing at: https://app.klingai.com/pricing

## Error Handling

The API returns meaningful error messages:

```json
{
  "success": false,
  "error": "Failed to submit try-on task to Kling AI: Invalid API credentials"
}
```

Common errors:
- `Invalid API credentials` - Check KLING_AI_API_KEY and KLING_AI_SECRET_KEY
- `Task not found` - Task ID expired (tasks expire after 24 hours)
- `Timeout` - Task took too long (>5 minutes)
- `No result images` - Kling AI couldn't generate the try-on

## Best Practices

1. **Image Quality**
   - Use clear, well-lit photos
   - Full-body person images work best
   - Product images should show the garment clearly

2. **Performance**
   - Implement loading states in UI
   - Show progress indicator while waiting
   - Cache results to reduce API calls

3. **User Experience**
   - Allow users to retake/upload different images
   - Show both original and try-on side-by-side
   - Enable download of try-on results

4. **Cost Optimization**
   - Use lower resolution images when possible
   - Batch similar requests
   - Cache frequently requested try-ons

## Troubleshooting

### "KLING_AI_API_KEY environment variable not found"
```bash
# Solution: Add to .env file
KLING_AI_API_KEY=your_key_here
```

### "Task polling timeout"
- Kling AI is experiencing delays
- Check https://app.klingai.com/status for service status
- Try again after a few minutes

### "Failed to download image"
- Network issue or Kling AI CDN unavailable
- Check internet connection
- Verify API credentials are valid

## Next Steps

1. ✅ Set up Kling AI credentials
2. ✅ Install dependencies
3. ✅ Test API endpoints
4. 📱 Create frontend try-on interface
5. 🎨 Integrate with product detail pages
6. 💾 Store try-on results in database

## Related Resources

- **Kling AI Docs:** https://app.klingai.com/global/dev/document-api
- **API Reference:** https://app.klingai.com/global/dev/document-api/apiReference
- **OpenTryOn Project:** https://github.com/tryonlabs/opentryon
- **Model Versions:** kolors-virtual-try-on-v1, kolors-virtual-try-on-v1-5 (latest)

## Support

For issues or questions:
1. Check Kling AI documentation
2. Review error messages in logs
3. Test with sample images first
4. Contact Kling AI support

---

**Last Updated:** January 2026
**Status:** Production Ready ✅
