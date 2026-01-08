#!/bin/bash

# Database Query Helper for VYBEX

DB_PATH="./vybex.db"

case "$1" in
  "brands")
    echo "📋 All Brands:"
    sqlite3 "$DB_PATH" "SELECT id, name, slug FROM brands ORDER BY created_at DESC;"
    ;;
  "products")
    echo "📦 All Products:"
    sqlite3 "$DB_PATH" "SELECT p.id, p.name, p.price, b.name as brand FROM products p JOIN brands b ON p.brand_id = b.id ORDER BY p.created_at DESC;"
    ;;
  "images")
    echo "🖼️  All Product Images:"
    sqlite3 "$DB_PATH" "SELECT pi.product_id, pi.image_url, pi.is_primary FROM product_images pi ORDER BY pi.product_id;"
    ;;
  "brand")
    if [ -z "$2" ]; then
      echo "Usage: $0 brand <brand_slug>"
      exit 1
    fi
    echo "📊 Brand: $2"
    sqlite3 "$DB_PATH" "SELECT * FROM brands WHERE slug = '$2';"
    echo ""
    echo "Products for $2:"
    sqlite3 "$DB_PATH" "SELECT id, name, price, stock_quantity FROM products WHERE brand_id = (SELECT id FROM brands WHERE slug = '$2');"
    ;;
  "stats")
    echo "📊 Database Statistics:"
    echo ""
    echo "Total Brands: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM brands;")"
    echo "Total Products: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM products;")"
    echo "Total Images: $(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM product_images;")"
    echo ""
    echo "Brands per Product: $(sqlite3 "$DB_PATH" "SELECT AVG(product_count) FROM (SELECT COUNT(*) as product_count FROM products GROUP BY brand_id);")"
    echo "Images per Product: $(sqlite3 "$DB_PATH" "SELECT AVG(image_count) FROM (SELECT COUNT(*) as image_count FROM product_images GROUP BY product_id);")"
    ;;
  "reset")
    echo "⚠️  Resetting database..."
    rm -f "$DB_PATH"
    node src/scripts/migrateAssets.js
    node src/scripts/seedDatabase.js
    ;;
  *)
    echo "VYBEX Database Helper"
    echo ""
    echo "Usage: $0 <command> [args]"
    echo ""
    echo "Commands:"
    echo "  brands              - List all brands"
    echo "  products            - List all products"
    echo "  images              - List all product images"
    echo "  brand <slug>        - Show brand details and products"
    echo "  stats               - Show database statistics"
    echo "  reset               - Reset and reseed database"
    ;;
esac
