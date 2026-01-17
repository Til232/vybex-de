import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { initDatabase } from './config/database.js';
import brandRoutes from './routes/brands.js';
import productRoutes from './routes/products.js';
import tryOnRoutes from './routes/tryOn.js';
import wardrobeRoutes from './routes/wardrobe.js';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/brands', brandRoutes);
app.use('/api/products', productRoutes);
app.use('/api/try-on', tryOnRoutes);
app.use('/api/wardrobe', wardrobeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Initialize database and start server
async function start() {
  try {
    await initDatabase();
    console.log('📚 Database initialized');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📋 API docs:`);
      console.log(`   - POST   /api/brands              - Create brand with logo`);
      console.log(`   - GET    /api/brands              - Get all brands`);
      console.log(`   - GET    /api/brands/:slug        - Get brand by slug`);
      console.log(`   - PUT    /api/brands/:id          - Update brand`);
      console.log(`   - DELETE /api/brands/:id          - Delete brand`);
      console.log(`   - POST   /api/products            - Create product with images`);
      console.log(`   - GET    /api/products/brand/:id  - Get products by brand`);
      console.log(`   - GET    /api/products/:id        - Get product details`);
      console.log(`   - PUT    /api/products/:id        - Update product`);
      console.log(`   - DELETE /api/products/:id        - Delete product`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
