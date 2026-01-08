# VYBEX Multi-Brand Shop Architecture

## 🏗️ System Overview

This is a **multi-brand fashion shop platform** where multiple brands can:
- Upload their logo and branding
- Create and manage products
- Upload product images
- Manage inventory and pricing

## 📁 Project Structure

```
vybex-de/
├── backend/                      # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js      # SQLite setup & connection
│   │   ├── models/
│   │   │   ├── Brand.js         # Brand data model
│   │   │   └── Product.js       # Product data model
│   │   ├── controllers/
│   │   │   ├── brandController.js    # Brand CRUD logic
│   │   │   └── productController.js  # Product CRUD logic
│   │   ├── routes/
│   │   │   ├── brands.js        # Brand endpoints
│   │   │   └── products.js      # Product endpoints
│   │   ├── middleware/
│   │   │   └── upload.js        # File upload handling
│   │   └── server.js            # Express app setup
│   ├── uploads/
│   │   ├── logos/               # Brand logos
│   │   └── products/            # Product images
│   ├── package.json
│   └── .env                     # Environment variables
│
├── frontend/                     # React/Vue admin dashboard (future)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── BrandDashboard.jsx
│   │   │   ├── ProductManager.jsx
│   │   │   └── Onboarding.jsx
│   │   └── api/
│   │       └── client.js        # API client
│   └── package.json
│
├── index.html                   # Public-facing shop homepage
├── styles.css
├── script.js
├── ARCHITECTURE.md
└── README.md
```

## 🗄️ Database Schema

### Brands Table
```sql
CREATE TABLE brands (
  id TEXT PRIMARY KEY,           -- UUID
  name TEXT NOT NULL UNIQUE,     -- Brand name
  slug TEXT NOT NULL UNIQUE,     -- URL-friendly identifier
  description TEXT,              -- Brand story/bio
  logo_url TEXT,                 -- Path to uploaded logo
  banner_url TEXT,               -- Optional banner image
  color_primary TEXT,            -- Brand primary color
  color_secondary TEXT,          -- Brand secondary color
  created_at DATETIME,
  updated_at DATETIME
);
```

### Products Table
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,           -- UUID
  brand_id TEXT NOT NULL,        -- Foreign key to brands
  name TEXT NOT NULL,            -- Product name
  description TEXT,              -- Product description
  price REAL NOT NULL,           -- Product price
  currency TEXT,                 -- Currency code (EUR, USD, etc.)
  category TEXT,                 -- Product category
  sku TEXT UNIQUE,               -- Stock keeping unit
  stock_quantity INTEGER,        -- Available inventory
  is_featured BOOLEAN,           -- Show on homepage
  created_at DATETIME,
  updated_at DATETIME
);
```

### Product Images Table
```sql
CREATE TABLE product_images (
  id TEXT PRIMARY KEY,           -- UUID
  product_id TEXT NOT NULL,      -- Foreign key to products
  image_url TEXT NOT NULL,       -- Path to image file
  alt_text TEXT,                 -- Image description
  display_order INTEGER,         -- Order in gallery
  is_primary BOOLEAN,            -- Primary product image
  created_at DATETIME
);
```

### Product Variants Table (Optional)
```sql
CREATE TABLE product_variants (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,            -- Size, Color, etc.
  value TEXT NOT NULL,           -- XL, Red, etc.
  price_modifier REAL,           -- +5€ for XL, etc.
  created_at DATETIME
);
```

## 🔌 API Endpoints

### Brands API

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/brands` | Create brand with logo | `name`, `description`, `logo` (file), `color_primary`, `color_secondary` |
| GET | `/api/brands` | Get all brands | - |
| GET | `/api/brands/:slug` | Get brand details | - |
| PUT | `/api/brands/:id` | Update brand | Same as POST |
| DELETE | `/api/brands/:id` | Delete brand | - |

### Products API

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/products` | Create product with images | `brand_id`, `name`, `price`, `description`, `images[]` (files), `category`, `sku`, `stock_quantity` |
| GET | `/api/products/brand/:brand_id` | Get brand's products | - |
| GET | `/api/products/:id` | Get product details | - |
| PUT | `/api/products/:id` | Update product | Same as POST |
| DELETE | `/api/products/:id` | Delete product | - |

## 💾 File Upload Structure

```
uploads/
├── logos/
│   ├── uuid-1.png       # Brand logo
│   ├── uuid-2.jpg
│   └── ...
└── products/
    ├── uuid-101.jpg     # Product image
    ├── uuid-102.jpg
    ├── uuid-103.png
    └── ...
```

## 🚀 Installation & Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Create Environment File
```bash
cp .env.example .env
```

### 3. Run Database Migration
```bash
npm run migrate
```

### 4. Start Backend
```bash
npm run dev          # Development with auto-reload
npm start            # Production
```

## 📝 Example: Create Brand & Product

### 1. Create Brand
```bash
curl -X POST http://localhost:5000/api/brands \
  -H "Content-Type: multipart/form-data" \
  -F "name=Nike" \
  -F "description=Premium athletic wear" \
  -F "logo=@nike-logo.png" \
  -F "color_primary=#FF0000"
```

Response:
```json
{
  "id": "uuid-abc123",
  "name": "Nike",
  "slug": "nike",
  "description": "Premium athletic wear",
  "logo_url": "/uploads/logos/uuid-abc123.png",
  "color_primary": "#FF0000",
  "created_at": "2026-01-08T10:00:00Z"
}
```

### 2. Create Product
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: multipart/form-data" \
  -F "brand_id=uuid-abc123" \
  -F "name=Air Max 90" \
  -F "price=120.00" \
  -F "category=Sneakers" \
  -F "description=Iconic running shoe" \
  -F "stock_quantity=50" \
  -F "images=@shoe1.jpg" \
  -F "images=@shoe2.jpg" \
  -F "alt_text_0=Front view" \
  -F "alt_text_1=Side view"
```

## 🔐 Security Considerations

1. **File Validation**: Only allow image formats (jpg, png, webp)
2. **File Size Limits**: Set max file size (5MB default)
3. **Path Traversal**: Multer stores with UUID filenames
4. **CORS**: Configure for your frontend domain
5. **Database**: Use parameterized queries (protection against SQL injection)
6. **Authentication**: Add JWT middleware for brand owners (future)

## 🚢 Deployment

### Backend (Node.js)
- **Option 1**: Railway.app (easiest)
- **Option 2**: Heroku
- **Option 3**: Self-hosted (Ubuntu server)

### Database
- **Option 1**: SQLite (development/small scale)
- **Option 2**: PostgreSQL (production)

### File Storage
- **Option 1**: Local filesystem (simple)
- **Option 2**: AWS S3 (scalable)
- **Option 3**: Cloudinary (managed service)

## 📊 Next Steps

1. ✅ Backend API scaffold (DONE)
2. 📋 Create React admin dashboard for brand onboarding
3. 📋 Add authentication (JWT)
4. 📋 Create public brand shop pages (dynamic)
5. 📋 Integrate payment system (Stripe)
6. 📋 Add inventory management
7. 📋 Create customer dashboard

## 🔄 Data Flow

```
Brand Admin
    ↓
Upload Logo + Brand Info
    ↓
POST /api/brands (with file)
    ↓
[Multer] Save file → uuid-xyz.png
    ↓
[Database] Store brand record + logo path
    ↓
Brand Page Generated: vybex.com/brand/nike
    ↓
Brand Admin Upload Products
    ↓
POST /api/products (with multiple images)
    ↓
[Multer] Save images → uuid-1.jpg, uuid-2.jpg
    ↓
[Database] Store product + image references
    ↓
Shop Page Shows Products: vybex.com/nike
```

## 📞 Support

For issues or questions about the architecture, check the comments in:
- `/backend/src/models/` - Data models
- `/backend/src/controllers/` - Business logic
- `/backend/src/routes/` - API endpoints
