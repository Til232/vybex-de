// README for Admin Dashboard

## 🎯 Admin Dashboard

Standalone admin panel for managing brands and products without needing a React/Vue setup.

### 📁 Files

- **admin.html** - Standalone admin panel (works with any backend)
- **api-client.js** - Reusable API client for React/Vue projects

### 🚀 Quick Start

1. **Start Backend**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Open Admin Panel**
   Open in browser:
   ```
   file:///.../frontend/admin.html
   ```
   Or serve with HTTP:
   ```bash
   cd frontend
   python3 -m http.server 8001
   # Visit http://localhost:8001/admin.html
   ```

### 📝 Admin Panel Features

✅ Create brands with logo upload
✅ View all brands
✅ Edit/delete brands
✅ Create products with multiple images
✅ View products by brand
✅ Edit/delete products
✅ Real-time form validation
✅ Color picker for brand colors

### 🎨 Usage Examples

#### Create Brand
1. Fill in brand name, description
2. Upload logo (PNG, JPG, WebP)
3. Choose brand colors
4. Click "Create Brand"

#### Create Product
1. Select brand from dropdown
2. Enter product details (name, price, description)
3. Select category
4. Upload product images (up to 10)
5. Click "Create Product"

### 🔌 API Client (for React/Vue)

```javascript
import { api } from './api-client.js';

// Create brand
const brand = await api.brands.create({
  name: 'Nike',
  description: 'Athletic wear',
  color_primary: '#FF0000',
  color_secondary: '#FFFFFF'
}, logoFile);

// Create product
const product = await api.products.create({
  brand_id: brand.id,
  name: 'Air Max 90',
  price: 120,
  category: 'Sneakers',
  description: 'Classic running shoe',
  stock_quantity: 50,
  is_featured: true
}, [imageFile1, imageFile2]);

// Get all brands
const brands = await api.brands.getAll();

// Get brand details
const brand = await api.brands.getBySlug('nike');

// Get products by brand
const products = await api.products.getByBrand(brandId);

// Update brand
await api.brands.update(brandId, updatedData, newLogoFile);

// Delete brand
await api.brands.delete(brandId);
```

### 🔐 Next Steps: Add Authentication

To restrict admin access, add JWT authentication:

```javascript
// Middleware for protected routes
import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token' });
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
```

Then protect routes:
```javascript
router.post('/', requireAuth, uploadSingle('logo'), brandController.createBrand);
router.post('/', requireAuth, uploadMultiple('images'), productController.createProduct);
```

### 📊 Database Queries

View your data using SQLite:
```bash
sqlite3 vybex.db

# List all brands
SELECT * FROM brands;

# List all products
SELECT * FROM products;

# Find products by brand
SELECT * FROM products WHERE brand_id = 'uuid-here';

# View product images
SELECT * FROM product_images;
```
