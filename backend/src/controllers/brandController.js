import { Brand } from '../models/Brand.js';
import path from 'path';

export const brandController = {
  async createBrand(req, res) {
    try {
      const { name, description, color_primary, color_secondary } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Brand name is required' });
      }

      let logo_url = null;
      if (req.file) {
        logo_url = `/uploads/${req.body.type || 'logos'}/${req.file.filename}`;
      }

      const brand = await Brand.create({
        name,
        description,
        logo_url,
        color_primary,
        color_secondary
      });

      res.status(201).json({ success: true, data: brand });
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'Brand name already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  },

  async getBrands(req, res) {
    try {
      const brands = await Brand.findAll();
      res.json({ success: true, data: brands });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async getBrandBySlug(req, res) {
    try {
      const brand = await Brand.findBySlug(req.params.slug);
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async updateBrand(req, res) {
    try {
      const { id } = req.params;
      const { name, description, color_primary, color_secondary } = req.body;
      
      const updates = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (color_primary !== undefined) updates.color_primary = color_primary;
      if (color_secondary !== undefined) updates.color_secondary = color_secondary;

      if (req.file) {
        updates.logo_url = `/uploads/${req.body.type || 'logos'}/${req.file.filename}`;
      }

      const brand = await Brand.update(id, updates);
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      res.json({ success: true, data: brand });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deleteBrand(req, res) {
    try {
      await Brand.delete(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};
