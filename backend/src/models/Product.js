import { db } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Product {
  static async create(productData) {
    const id = uuidv4();

    await db.run(
      `INSERT INTO products (id, brand_id, name, description, price, currency, category, sku, stock_quantity, is_featured)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        productData.brand_id,
        productData.name,
        productData.description || null,
        productData.price,
        productData.currency || 'EUR',
        productData.category || null,
        productData.sku || null,
        productData.stock_quantity || 0,
        productData.is_featured ? 1 : 0
      ]
    );

    return this.findById(id);
  }

  static async findById(id) {
    const product = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    if (product) {
      product.images = await db.all(
        'SELECT id, image_url, alt_text, is_primary FROM product_images WHERE product_id = ? ORDER BY display_order',
        [id]
      );
      product.variants = await db.all(
        'SELECT id, name, value, price_modifier FROM product_variants WHERE product_id = ?',
        [id]
      );
    }
    return product;
  }

  static async findByBrandId(brandId) {
    return await db.all(
      'SELECT * FROM products WHERE brand_id = ? ORDER BY created_at DESC',
      [brandId]
    );
  }

  static async update(id, productData) {
    const updates = [];
    const values = [];

    Object.entries(productData).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'brand_id') {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    await db.run(
      `UPDATE products SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    return this.findById(id);
  }

  static async addImage(productId, imageUrl, altText = null, isPrimary = false) {
    const id = uuidv4();
    const order = await db.get(
      'SELECT MAX(display_order) as maxOrder FROM product_images WHERE product_id = ?',
      [productId]
    );
    const nextOrder = (order?.maxOrder || -1) + 1;

    await db.run(
      `INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_primary)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, productId, imageUrl, altText, nextOrder, isPrimary ? 1 : 0]
    );

    return id;
  }

  static async delete(id) {
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  }
}
