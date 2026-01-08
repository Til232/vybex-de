# 🛍️ VYBEX - Multi-Brand Fashion Shop

Professional multi-brand e-commerce platform where different brands can onboard, upload products, and manage their shops.

## 🎯 System Overview

```
VYBEX Platform
├── Public Shop (index.html)
│   └── Dynamic brand pages displaying products
├── Admin Dashboard (frontend/admin.html)
│   ├── Brand Onboarding
│   └── Product Management
└── Backend API (backend/src/server.js)
    ├── Brand Management
    ├── Product Management
    └── File Upload Handling
```

## 📁 Project Structure

```
vybex-de/
├── backend/                              # Node.js/Express API
│   ├── src/
│   │   ├── config/database.js           # SQLite database setup
│   │   ├── models/                      # Data models
│   │   │   ├── Brand.js                # Brand CRUD operations
│   │   │   └── Product.js              # Product CRUD operations
│   │   ├── controllers/                 # Business logic
│   │   │   ├── brandController.js
│   │   │   └── productController.js
│   │   ├── routes/                      # API endpoints
│   │   │   ├── brands.js
│   │   │   └── products.js
│   │   ├── middleware/
│   │   │   └── upload.js               # File upload handling
│   │   └── server.js                   # Express app entry point
│   ├── uploads/                         # Uploaded files storage
│   │   ├── logos/                      # Brand logos
│   │   └── products/                   # Product images
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/                             # Admin dashboard + API client
│   ├── admin.html                      # Standalone admin panel
│   ├── api-client.js                   # Reusable API client
│   └── README.md
│
├── index.html                           # Public-facing shop
├── styles.css
├── script.js
│
├── ARCHITECTURE.md                      # Detailed technical docs
└── README.md                           # This file
```

## 🚀 Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Create Environment File
```bash
cp .env.example .env
```

### Step 3: Start Backend Server
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

You should see:
```
📚 Database initialized
🚀 Server running on http://localhost:5000
```

### Step 4: Open Admin Dashboard
In your browser, open:
```
file:///.../vybex-de/frontend/admin.html
```

Or serve it with HTTP:
```bash
# In a new terminal, from frontend/
python3 -m http.server 8001
# Visit http://localhost:8001/admin.html
```

## 📊 Database Schema

### Brands
```sql
id              - UUID primary key
name            - Brand name (UNIQUE)
slug            - URL-friendly name (UNIQUE)
description     - Brand story/bio
logo_url        - Path to logo file
banner_url      - Optional banner image
color_primary   - Brand primary color (hex)
color_secondary - Brand secondary color (hex)
created_at      - Timestamp
updated_at      - Timestamp
```

### Products
```sql
id              - UUID primary key
brand_id        - Foreign key to brands
name            - Product name
description     - Product details
price           - Price in EUR
currency        - Currency code
category        - Product category (T-Shirt, Jeans, etc.)
sku             - Stock keeping unit
stock_quantity  - Available inventory
is_featured     - Show on homepage
created_at      - Timestamp
updated_at      - Timestamp
```

### Product Images
```sql
id              - UUID primary key
product_id      - Foreign key to products
image_url       - Path to image file
alt_text        - Image description
display_order   - Order in gallery
is_primary      - Primary product image
created_at      - Timestamp
```

## 🔌 API Reference

### Brands Endpoints

#### Create Brand
```bash
POST /api/brands
Content-Type: multipart/form-data

name: "Nike"
description: "Premium athletic wear"
logo: [file]
color_primary: "#FF0000"
color_secondary: "#FFFFFF"
```

#### Get All Brands
```bash
GET /api/brands
```

#### Get Brand by Slug
```bash
GET /api/brands/nike
```

#### Update Brand
```bash
PUT /api/brands/{id}
Content-Type: multipart/form-data
```

#### Delete Brand
```bash
DELETE /api/brands/{id}
```

### Products Endpoints

#### Create Product
```bash
POST /api/products
Content-Type: multipart/form-data

brand_id: "uuid-123"
name: "Air Max 90"
price: "120.00"
description: "Classic running shoe"
category: "Sneakers"
stock_quantity: "50"
is_featured: "true"
images: [file1, file2, ...]
```

#### Get Products by Brand
```bash
GET /api/products/brand/{brand_id}
```

#### Get Product Details
```bash
GET /api/products/{id}
```

#### Update Product
```bash
PUT /api/products/{id}
Content-Type: multipart/form-data
```

#### Delete Product
```bash
DELETE /api/products/{id}
```

## 📝 Example: Complete Brand Onboarding

### 1. Create Brand

```bash
curl -X POST http://localhost:5000/api/brands \
  -H "Content-Type: multipart/form-data" \
  -F "name=Adidas" \
  -F "description=Performance sportswear and footwear" \
  -F "logo=@adidas-logo.png" \
  -F "color_primary=#000000" \
  -F "color_secondary=#FFFFFF"
```

Response:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Adidas",
  "slug": "adidas",
  "description": "Performance sportswear and footwear",
  "logo_url": "/uploads/logos/550e8400-uuid.png",
  "color_primary": "#000000",
  "color_secondary": "#FFFFFF",
  "created_at": "2026-01-08T10:00:00Z",
  "updated_at": "2026-01-08T10:00:00Z"
}
```

### 2. Create Product

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: multipart/form-data" \
  -F "brand_id=550e8400-e29b-41d4-a716-446655440000" \
  -F "name=Stan Smith" \
  -F "price=89.99" \
  -F "description=Iconic leather tennis shoe" \
  -F "category=Sneakers" \
  -F "stock_quantity=100" \
  -F "is_featured=true" \
  -F "images=@shoe-front.jpg" \
  -F "images=@shoe-side.jpg" \
  -F "alt_text_0=Front view of Stan Smith" \
  -F "alt_text_1=Side view of Stan Smith"
```

Response:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "brand_id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Stan Smith",
  "price": 89.99,
  "description": "Iconic leather tennis shoe",
  "category": "Sneakers",
  "stock_quantity": 100,
  "is_featured": true,
  "images": [
    {
      "id": "img-1",
      "image_url": "/uploads/products/uuid-1.jpg",
      "alt_text": "Front view of Stan Smith",
      "is_primary": true
    },
    {
      "id": "img-2",
      "image_url": "/uploads/products/uuid-2.jpg",
      "alt_text": "Side view of Stan Smith",
      "is_primary": false
    }
  ],
  "created_at": "2026-01-08T10:05:00Z"
}
```

### 3. Get Brand Products

```bash
curl http://localhost:5000/api/products/brand/550e8400-e29b-41d4-a716-446655440000
```

## 🛡️ File Upload Security

✅ **File Type Validation**: Only images (JPG, PNG, WebP)
✅ **File Size Limits**: Max 5MB per file
✅ **Path Traversal Protection**: UUID-based filenames
✅ **MIME Type Checking**: Server-side validation
✅ **Unique Storage**: Prevents filename collisions

Allowed formats: `jpg`, `jpeg`, `png`, `webp`
Max file size: `5MB` (configurable in `.env`)

## 📦 Admin Dashboard Features

### Brand Management
- ✅ Create brands with logo upload
- ✅ View all brands
- ✅ Edit brand details and colors
- ✅ Delete brands
- ✅ Search and filter

### Product Management
- ✅ Create products with up to 10 images
- ✅ Select from existing brands
- ✅ Manage categories, pricing, stock
- ✅ Feature products on homepage
- ✅ Edit product details
- ✅ Delete products

### User-Friendly Features
- 📋 Form validation with clear error messages
- 🎨 Color picker for brand colors
- 📸 Multiple image upload with preview
- 🔄 Real-time brand/product list updates
- 📱 Responsive design

## 🔐 Security Considerations

### Current Security
- ✅ Input validation on API
- ✅ File type and size restrictions
- ✅ SQL injection prevention (parameterized queries)
- ✅ Path traversal protection

### Recommended Additions
- 🔒 Add JWT authentication for admin users
- 🔒 Rate limiting on API endpoints
- 🔒 CORS configuration for production domains
- 🔒 Content Security Policy headers
- 🔒 Input sanitization for text fields

### Example: Add JWT Authentication

```javascript
// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(403).json({ error: 'Invalid token' });
  }
}

// Then protect routes:
router.post('/', requireAuth, uploadSingle('logo'), brandController.createBrand);
```

## 📊 Database Management

### View Database
```bash
# Install SQLite (if not already installed)
# macOS: brew install sqlite3
# Linux: apt-get install sqlite3

# Open database
sqlite3 backend/vybex.db

# Common queries
SELECT * FROM brands;                              # List all brands
SELECT * FROM products;                            # List all products
SELECT * FROM product_images;                      # List all images
SELECT * FROM products WHERE brand_id = 'uuid';   # Products by brand
```

### Reset Database
```bash
rm backend/vybex.db
npm run migrate  # in backend directory
```

## 🚢 Deployment

### Backend Deployment Options

**Option 1: Railway.app (Recommended)**
1. Push code to GitHub
2. Connect GitHub repo to Railway
3. Deploy automatically
4. Database: Railway PostgreSQL

**Option 2: Heroku**
```bash
heroku login
heroku create vybex-backend
git push heroku main
```

**Option 3: Self-Hosted (Ubuntu Server)**
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo> /var/www/vybex
cd /var/www/vybex/backend
npm install

# Start with PM2
npm install -g pm2
pm2 start src/server.js
pm2 startup
pm2 save
```

### Frontend Deployment

**Option 1: GitHub Pages**
```bash
git add .
git commit -m "Deploy"
git push origin main
```

**Option 2: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 3: Netlify**
Connect GitHub repo in Netlify dashboard

## 🔄 Development Workflow

1. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

2. **Open Admin Dashboard**
   ```
   file:///.../frontend/admin.html
   ```

3. **Create Brands & Products**
   Use the admin interface to create test data

4. **Test Public Shop**
   Open `index.html` and verify it displays products

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Add brands and products"
   git push
   ```

## 🧪 Testing the API

### Test with cURL
```bash
# Create brand
curl -X POST http://localhost:5000/api/brands \
  -F "name=TestBrand" \
  -F "description=Test" \
  -F "logo=@logo.png"

# Get all brands
curl http://localhost:5000/api/brands

# Create product
curl -X POST http://localhost:5000/api/products \
  -F "brand_id=<uuid>" \
  -F "name=TestProduct" \
  -F "price=99.99" \
  -F "images=@image.jpg"
```

### Test with Postman
1. Import API endpoints into Postman
2. Set `{{API_BASE}}` variable to `http://localhost:5000/api`
3. Use form-data for file uploads
4. Test each endpoint

## 📚 Documentation Files

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Complete technical architecture
- **[backend/package.json](./backend/package.json)** - Backend dependencies
- **[frontend/README.md](./frontend/README.md)** - Admin dashboard guide
- **This README** - Project overview and setup guide

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Locked
```bash
# Remove database and reinitialize
rm backend/vybex.db
npm run migrate
```

### CORS Errors
Update `backend/src/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true
}));
```

### File Upload Not Working
1. Check `backend/uploads/` directory exists
2. Verify file size < 5MB
3. Check file format is .jpg, .png, or .webp
4. Check file permissions: `chmod 755 uploads/`

## 📞 Next Steps

- [ ] Add user authentication (JWT)
- [ ] Create public brand showcase pages
- [ ] Build shopping cart functionality
- [ ] Integrate payment processing (Stripe)
- [ ] Add inventory management
- [ ] Create customer dashboard
- [ ] Set up analytics
- [ ] Implement search and filters

## 📄 License

MIT

---

**Questions?** Check [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical information.
