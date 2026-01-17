import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';

export class Wardrobe {
  static async create(wardrobeData) {
    const {
      userId,
      productId,
      imageUrl,
      color,
      size,
      notes
    } = wardrobeData;

    const id = uuidv4();
    const now = new Date().toISOString();

    const result = await db.run(
      `INSERT INTO wardrobe_items 
       (id, user_id, product_id, image_url, color, size, notes, added_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, userId, productId, imageUrl, color, size, notes, now]
    );

    return this.findById(id);
  }

  static async findById(id) {
    return await db.get(
      `SELECT wi.*, p.name, p.price, b.name as brand_name
       FROM wardrobe_items wi
       JOIN products p ON wi.product_id = p.id
       JOIN brands b ON p.brand_id = b.id
       WHERE wi.id = ?`,
      [id]
    );
  }

  static async findByUserId(userId) {
    return await db.all(
      `SELECT wi.*, p.name, p.price, p.category, b.name as brand_name, pi.image_url as product_image
       FROM wardrobe_items wi
       JOIN products p ON wi.product_id = p.id
       JOIN brands b ON p.brand_id = b.id
       LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
       WHERE wi.user_id = ?
       ORDER BY wi.added_at DESC`,
      [userId]
    );
  }

  static async update(id, wardrobeData) {
    const { tryOnImageUrl, notes, color, size } = wardrobeData;
    
    const updates = [];
    const values = [];

    if (tryOnImageUrl !== undefined) {
      updates.push('try_on_image_url = ?');
      values.push(tryOnImageUrl);
    }
    if (notes !== undefined) {
      updates.push('notes = ?');
      values.push(notes);
    }
    if (color !== undefined) {
      updates.push('color = ?');
      values.push(color);
    }
    if (size !== undefined) {
      updates.push('size = ?');
      values.push(size);
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);

    await db.run(
      `UPDATE wardrobe_items SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async delete(id) {
    await db.run('DELETE FROM wardrobe_items WHERE id = ?', [id]);
    return { success: true };
  }

  static async deleteByUser(userId) {
    await db.run('DELETE FROM wardrobe_items WHERE user_id = ?', [userId]);
    return { success: true };
  }

  static async getCount(userId) {
    const result = await db.get(
      'SELECT COUNT(*) as count FROM wardrobe_items WHERE user_id = ?',
      [userId]
    );
    return result.count;
  }
}

export default Wardrobe;
