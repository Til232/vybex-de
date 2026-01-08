import { getDatabase } from '../config/database.js';
import { Brand } from '../models/Brand.js';
import { Product } from '../models/Product.js';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const testBrands = [
  {
    name: 'Nike',
    description: 'Premium athletic wear and footwear for performance and style',
    color_primary: '#000000',
    color_secondary: '#FFFFFF',
    logo: 'tshirt-black.jpg'
  },
  {
    name: 'Adidas',
    description: 'German multinational corporation specializing in sportswear',
    color_primary: '#000000',
    color_secondary: '#CCFF00',
    logo: 'tshirt-white.jpg'
  },
  {
    name: 'Puma',
    description: 'High-performance athletic and lifestyle brand',
    color_primary: '#000000',
    color_secondary: '#FF0000',
    logo: 'tshirt-2.jpg'
  },
  {
    name: 'The North Face',
    description: 'Outdoor clothing and gear for adventurers',
    color_primary: '#1F1F1F',
    color_secondary: '#FFC600',
    logo: 'hoodie-1.jpg'
  },
  {
    name: 'Gucci',
    description: 'Luxury fashion brand with timeless designs',
    color_primary: '#005C28',
    color_secondary: '#FFD700',
    logo: 'tshirt-3.jpg'
  },
  {
    name: 'Balenciaga',
    description: 'Contemporary luxury brand pushing fashion boundaries',
    color_primary: '#000000',
    color_secondary: '#FFFFFF',
    logo: 'jeans-1.jpg'
  },
  {
    name: 'Supreme',
    description: 'Streetwear and skate culture brand',
    color_primary: '#FF0000',
    color_secondary: '#FFFFFF',
    logo: 'jeans-2.jpg'
  },
  {
    name: 'Stüssy',
    description: 'Pioneering streetwear and surf culture',
    color_primary: '#000000',
    color_secondary: '#FFFFFF',
    logo: 'hoodie-2.jpg'
  },
  {
    name: 'Vans',
    description: 'Iconic skate and lifestyle brand',
    color_primary: '#000000',
    color_secondary: '#FFFFFF',
    logo: 'sneaker-1.jpg'
  },
  {
    name: 'Converse',
    description: 'Timeless sneaker and apparel company',
    color_primary: '#000000',
    color_secondary: '#FFFFFF',
    logo: 'sneaker-2.jpg'
  }
];

const productImages = {
  'tshirt-black.jpg': ['tshirt-black.jpg', 'tshirt-white.jpg'],
  'tshirt-white.jpg': ['tshirt-white.jpg', 'tshirt-black.jpg'],
  'tshirt-2.jpg': ['tshirt-2.jpg', 'tshirt-3.jpg'],
  'tshirt-3.jpg': ['tshirt-3.jpg', 'tshirt-2.jpg'],
  'jeans-1.jpg': ['jeans-1.jpg', 'jeans-2.jpg'],
  'jeans-2.jpg': ['jeans-2.jpg', 'jeans-1.jpg'],
  'hoodie-1.jpg': ['hoodie-1.jpg', 'hoodie-2.jpg'],
  'hoodie-2.jpg': ['hoodie-2.jpg', 'hoodie-1.jpg'],
  'sneaker-1.jpg': ['sneaker-1.jpg', 'sneaker-2.jpg', 'sneaker-3.jpg'],
  'sneaker-2.jpg': ['sneaker-2.jpg', 'sneaker-3.jpg', 'sneaker-1.jpg']
};

const productCategories = {
  'Nike': ['T-Shirts', 'Sneakers'],
  'Adidas': ['T-Shirts', 'Jeans'],
  'Puma': ['Hoodies', 'Sneakers'],
  'The North Face': ['Hoodies', 'Jackets'],
  'Gucci': ['T-Shirts', 'Accessories'],
  'Balenciaga': ['Jeans', 'Sneakers'],
  'Supreme': ['T-Shirts', 'Hoodies'],
  'Stüssy': ['T-Shirts', 'Jeans'],
  'Vans': ['Sneakers', 'Hoodies'],
  'Converse': ['Sneakers', 'T-Shirts']
};

const productNames = {
  'Nike': ['Air Max 90', 'Essential Tee', 'Court Borough'],
  'Adidas': ['Stan Smith', 'Classic Logo Tee', '3-Stripe Jeans'],
  'Puma': ['Suede Classic', 'Cat Logo Hoodie', 'Court Play'],
  'The North Face': ['Mountain Jacket', 'Base Camp Hoodie', 'Summit Vest'],
  'Gucci': ['GG Supreme Tee', 'Double G Sneaker', 'Logo Print Shirt'],
  'Balenciaga': ['Triple S Sneaker', 'Logo Hoodie', 'Distressed Jeans'],
  'Supreme': ['Box Logo Tee', 'Supreme Hoodie', 'Collaboration Shirt'],
  'Stüssy': ['Link Tee', 'Stock Hoodie', 'Classic Jeans'],
  'Vans': ['Old Skool', 'Vans Tee', 'Authentic Sneaker'],
  'Converse': ['Chuck Taylor All Star', 'Logo Shirt', 'Platform Sneaker']
};

async function seedDatabase() {
  try {
    const db = await getDatabase();
    
    console.log('🌱 Seeding database with 10 test brands...\n');

    for (let i = 0; i < testBrands.length; i++) {
      const brandData = testBrands[i];
      
      // Create brand
      const brand = await Brand.create({
        name: brandData.name,
        description: brandData.description,
        color_primary: brandData.color_primary,
        color_secondary: brandData.color_secondary,
        logo_url: `/uploads/logos/${brandData.logo}`
      });

      console.log(`✅ Created brand: ${brand.name} (ID: ${brand.id.slice(0, 8)}...)`);

      // Create 3 products per brand
      const products = productNames[brandData.name];
      const categories = productCategories[brandData.name];
      
      for (let j = 0; j < 3; j++) {
        const productPrice = Math.floor(Math.random() * (150 - 50 + 1)) + 50;
        const category = categories[j % categories.length];

        const product = await Product.create({
          brand_id: brand.id,
          name: products[j],
          description: `Premium ${category.toLowerCase()} from ${brand.name}`,
          price: productPrice,
          currency: 'EUR',
          category: category,
          sku: `${brand.name.toUpperCase()}-${j + 1}`,
          stock_quantity: Math.floor(Math.random() * 100) + 20,
          is_featured: Math.random() > 0.5
        });

        // Add 2-3 images per product
        const images = productImages[brandData.logo];
        for (let k = 0; k < (Math.random() > 0.5 ? 3 : 2); k++) {
          const imageFile = images[k % images.length];
          await Product.addImage(
            product.id,
            `/uploads/products/${imageFile}`,
            `${products[j]} - Image ${k + 1}`,
            k === 0
          );
        }

        console.log(`   📦 Product: ${product.name} (€${product.price})`);
      }

      console.log('');
    }

    console.log('✨ Database seeding complete!');
    console.log('\n📊 Summary:');
    console.log('   - 10 brands created');
    console.log('   - 30 products created');
    console.log('   - Product images assigned');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
