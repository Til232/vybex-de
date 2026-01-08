import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrateAssets() {
  const srcDir = path.join(__dirname, '../../../assets/images');
  const uploadDir = path.join(__dirname, '../../uploads');

  try {
    console.log('📦 Migrating images from assets/ to backend/uploads/\n');

    // Ensure uploads directories exist
    await fs.ensureDir(path.join(uploadDir, 'logos'));
    await fs.ensureDir(path.join(uploadDir, 'products'));
    await fs.ensureDir(path.join(uploadDir, 'avatars'));

    // Copy product images
    const productDir = path.join(srcDir, 'products');
    if (fs.existsSync(productDir)) {
      const files = fs.readdirSync(productDir);
      for (const file of files) {
        const src = path.join(productDir, file);
        const dst = path.join(uploadDir, 'products', file);
        if (!fs.existsSync(dst)) {
          await fs.copy(src, dst);
          console.log(`✅ Copied: products/${file}`);
        }
      }
    }

    // Copy hero images (use first as logo for some brands)
    const heroDir = path.join(srcDir, 'hero');
    if (fs.existsSync(heroDir)) {
      const files = fs.readdirSync(heroDir);
      for (const file of files) {
        const src = path.join(heroDir, file);
        const dst = path.join(uploadDir, 'products', file);
        if (!fs.existsSync(dst)) {
          await fs.copy(src, dst);
          console.log(`✅ Copied: products/${file}`);
        }
      }
    }

    // Copy avatar images
    const avatarDir = path.join(srcDir, 'avatars');
    if (fs.existsSync(avatarDir)) {
      const files = fs.readdirSync(avatarDir);
      for (const file of files) {
        const src = path.join(avatarDir, file);
        const dst = path.join(uploadDir, 'avatars', file);
        if (!fs.existsSync(dst)) {
          await fs.copy(src, dst);
          console.log(`✅ Copied: avatars/${file}`);
        }
      }
    }

    // Use some product images as brand logos
    const logoDir = path.join(uploadDir, 'logos');
    const productLogos = ['tshirt-black.jpg', 'tshirt-white.jpg', 'tshirt-2.jpg', 'tshirt-3.jpg', 
                          'jeans-1.jpg', 'jeans-2.jpg', 'hoodie-1.jpg', 'hoodie-2.jpg', 
                          'sneaker-1.jpg', 'sneaker-2.jpg'];
    
    for (const logo of productLogos) {
      const src = path.join(uploadDir, 'products', logo);
      const dst = path.join(logoDir, logo);
      if (fs.existsSync(src) && !fs.existsSync(dst)) {
        await fs.copy(src, dst);
        console.log(`✅ Created logo: ${logo}`);
      }
    }

    console.log('\n✨ Asset migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateAssets();
