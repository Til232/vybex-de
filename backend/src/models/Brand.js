import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Brand {
  static async create(brandData) {
    const id = uuidv4();
    const slug = brandData.name.toLowerCase().replace(/\s+/g, '-');

    const result = await db.run(
      `INSERT INTO brands (id, name, slug, description, logo_url, banner_url, color_primary, color_secondary)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        brandData.name,
        slug,
        brandData.description || null,
        brandData.logo_url || null,
        brandData.banner_url || null,
        brandData.color_primary || '#000000',
        brandData.color_secondary || '#FFFFFF'
      ]
    );

    return this.findById(id);
  }

  static async findById(id) {
    return await db.get('SELECT * FROM brands WHERE id = ?', [id]);
  }

  static async findBySlug(slug) {
    return await db.get('SELECT * FROM brands WHERE slug = ?', [slug]);
  }

  static async findAll() {
    return await db.all('SELECT * FROM brands ORDER BY created_at DESC');
  }

  static async update(id, brandData) {
    const updates = [];
    const values = [];

    Object.entries(brandData).forEach(([key, value]) => {
      if (key !== 'id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.run(
      `UPDATE brands SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id) {
    await db.run('DELETE FROM brands WHERE id = ?', [id]);
  }
}
