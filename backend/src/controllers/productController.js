import { Product } from '../models/Product.js';

export const productController = {
  async createProduct(req, res) {
    try {
      const { brand_id, name, description, price, category, sku, stock_quantity, is_featured } = req.body;

      if (!brand_id || !name || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields: brand_id, name, price' });
      }

      const product = await Product.create({
        brand_id,
        name,
        description,
        price: parseFloat(price),
        category,
        sku,
        stock_quantity: parseInt(stock_quantity) || 0,
        is_featured: is_featured === 'true' || is_featured === true
      });

      // Handle multiple image uploads
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const imageUrl = `/uploads/products/${file.filename}`;
          await Product.addImage(
            product.id,
            imageUrl,
            req.body[`alt_text_${i}`] || null,
            i === 0 // First image is primary
          );
        }
      }

      const updatedProduct = await Product.findById(product.id);
      res.status(201).json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProductsByBrand(req, res) {
    try {
      const products = await Product.findByBrandId(req.params.brand_id);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getProduct(req, res) {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateProduct(req, res) {
    try {
      const product = await Product.update(req.params.id, req.body);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Handle new image uploads
      if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
          const file = req.files[i];
          const imageUrl = `/uploads/products/${file.filename}`;
          await Product.addImage(product.id, imageUrl, req.body[`alt_text_${i}`] || null);
        }
      }

      const updatedProduct = await Product.findById(product.id);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteProduct(req, res) {
    try {
      await Product.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
