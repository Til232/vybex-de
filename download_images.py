#!/usr/bin/env python3
"""
Download fashion/streetwear images for VYBEX
Organized in: assets/images/products/, assets/images/hero/, assets/images/avatars/
"""

import urllib.request
import ssl
import os
from pathlib import Path

# Disable SSL verification for macOS
ssl._create_default_https_context = ssl._create_unverified_context

# Create image directories
base_dir = Path(__file__).parent / "assets" / "images"
products_dir = base_dir / "products"
hero_dir = base_dir / "hero"
avatars_dir = base_dir / "avatars"

for d in [products_dir, hero_dir, avatars_dir]:
    d.mkdir(parents=True, exist_ok=True)

# Image URLs from Unsplash
images = {
    "products": {
        "tshirt-black.jpg": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&w=500&h=500&fit=crop&q=80",
        "tshirt-white.jpg": "https://images.unsplash.com/photo-1503341455253-b2e723bb12dd?ixlib=rb-4.0.3&w=500&h=500&fit=crop&q=80",
        "sneaker-1.jpg": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&w=500&h=500&fit=crop&q=80",
        "sneaker-2.jpg": "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&w=500&h=500&fit=crop&q=80",
        "jeans-1.jpg": "https://images.unsplash.com/photo-1542272604-787c62d465d1?ixlib=rb-4.0.3&w=500&h=500&fit=crop&q=80",
        "hoodie-1.jpg": "https://images.unsplash.com/photo-1556821552-5282c5c3b9bb?ixlib=rb-4.0.3&w=500&h=500&fit=crop&q=80",
    },
    "hero": {
        "fashion-model-1.jpg": "https://images.unsplash.com/photo-1509631179647-0177331693ae?ixlib=rb-4.0.3&w=1200&h=600&fit=crop&q=80",
        "fashion-model-2.jpg": "https://images.unsplash.com/photo-1543163521-9145f931371e?ixlib=rb-4.0.3&w=1200&h=600&fit=crop&q=80",
    },
    "avatars": {
        "user-1.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80",
        "user-2.jpg": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&q=80",
        "user-3.jpg": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80",
    }
}

print("📥 Downloading images to assets/images/...")
print("=" * 70)

total_success = 0
total_failed = 0

for category, urls in images.items():
    print(f"\n📁 {category.upper()}/")
    print("-" * 70)
    
    if category == "products":
        target_dir = products_dir
    elif category == "hero":
        target_dir = hero_dir
    else:
        target_dir = avatars_dir
    
    for filename, url in urls.items():
        filepath = target_dir / filename
        try:
            print(f"  ⬇️  {filename}...", end=" ", flush=True)
            urllib.request.urlretrieve(url, filepath)
            file_size = os.path.getsize(filepath) / 1024
            print(f"✅ ({file_size:.1f} KB)")
            total_success += 1
        except Exception as e:
            print(f"❌ Failed: {str(e)[:40]}")
            total_failed += 1

print("\n" + "=" * 70)
print(f"✅ Successfully downloaded: {total_success} images")
if total_failed > 0:
    print(f"❌ Failed: {total_failed} images")

print(f"\n📁 Location: assets/images/")
print(f"   ├── products/ ({len(list(products_dir.glob('*')))} images)")
print(f"   ├── hero/ ({len(list(hero_dir.glob('*')))} images)")
print(f"   └── avatars/ ({len(list(avatars_dir.glob('*')))} images)")

print("\n💡 Use in HTML like:")
print('   <img src="assets/images/products/tshirt-black.jpg">')
print('   <img src="assets/images/hero/fashion-model-1.jpg">')
print('   <img src="assets/images/avatars/user-1.jpg">')
