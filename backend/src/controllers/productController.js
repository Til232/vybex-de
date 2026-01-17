import { Product } from '../models/Product.js';

export const productController = {
  async createProduct(req, res) {
    try {
      const { brand_id, name, price, size } = req.body;

      if (!brand_id || !name || price === undefined) {
        return res.status(400).json({ error: 'Missing required fields: brand_id, name, price' });
      }

      const product = await Product.create({
        brand_id,
        name,
        description: req.body.description || '',
        price: parseFloat(price),
        size: size || '',
        category: '',
        sku: '',
        stock_quantity: 0,
        is_featured: false
      });

      // Handle image upload
      if (req.file) {
        const imageUrl = `/uploads/products/${req.file.filename}`;
        await Product.addImage(product.id, imageUrl, null, true);
      }

      const updatedProduct = await Product.findById(product.id);
      res.status(201).json({ success: true, data: updatedProduct });
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
      const { name, price, size, description } = req.body;
      
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (price !== undefined) updates.price = parseFloat(price);
      if (size !== undefined) updates.size = size;
      if (description !== undefined) updates.description = description;

      const product = await Product.update(req.params.id, updates);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Handle image upload
      if (req.file) {
        const imageUrl = `/uploads/products/${req.file.filename}`;
        await Product.addImage(product.id, imageUrl, null, true);
      }

      const updatedProduct = await Product.findById(product.id);
      res.json({ success: true, data: updatedProduct });
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
