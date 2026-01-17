const API_BASE = 'http://localhost:5001/api';

console.log("VYBEX ready!");

// Load brands and products on page load
document.addEventListener('DOMContentLoaded', async () => {
  await loadBrandsAndProducts();
  setupMobileMenu();
});

async function loadBrandsAndProducts() {
  try {
    const brandsRes = await fetch(`${API_BASE}/brands`);
    const brands = await brandsRes.json();
    
    if (!brands || brands.length === 0) return;

    // Create a brand map for quick lookup
    const brandMap = {};
    brands.forEach(b => {
      brandMap[b.id] = b;
    });

    // Get all products
    const productRows = [];
    for (const brand of brands) {
      const productsRes = await fetch(`${API_BASE}/products/brand/${brand.id}`);
      const products = await productsRes.json();
      if (products && products.length > 0) {
        productRows.push({ brand, products: products.slice(0, 4) });
      }
    }

    // Generate products HTML with brand logos
    let productsHTML = `
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
    `;

    productRows.forEach(({ brand, products }) => {
      products.forEach(product => {
        productsHTML += `
          <div class="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition group">
            <div class="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden bg-gray-200">
              ${product.image_url ? `<img src="${API_BASE}${product.image_url}" alt="${product.name}" class="w-full h-full object-cover group-hover:scale-105 transition">` : `<div class="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Kein Bild</div>`}
              ${brand.logo_url ? `<div class="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white rounded-full p-2 shadow-md"><img src="${API_BASE}${brand.logo_url}" alt="${brand.name}" class="h-8 w-8 object-contain"></div>` : ''}
            </div>
            <div class="p-3 sm:p-4">
              <p class="text-xs sm:text-sm text-gray-500 mb-1">${brand.name}</p>
              <h4 class="text-base sm:text-lg font-semibold text-gray-900 mb-1">${product.name}</h4>
              <p class="text-gray-600 text-xs sm:text-sm mb-3">${product.size || 'One Size'}</p>
              <div class="flex justify-between items-center gap-2">
                <span class="text-lg sm:text-2xl font-bold text-gray-900">€${parseFloat(product.price).toFixed(2)}</span>
                <button class="bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-800 transition text-sm whitespace-nowrap">
                  🛒
                </button>
              </div>
            </div>
          </div>
        `;
      });
    });

    productsHTML += `
      </div>
      <div class="text-center mt-8 md:mt-12">
        <button class="bg-gray-900 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-800 transition text-sm sm:text-base">
          Alle Produkte anzeigen
        </button>
      </div>
    `;

    // Update products section
    const productsSection = document.querySelector('#products .max-w-7xl');
    if (productsSection) {
      const heading = productsSection.querySelector('div:first-child');
      productsSection.innerHTML = heading.outerHTML + productsHTML;
    }
  } catch (error) {
    console.error('Fehler beim Laden der Produkte:', error);
  }
}

function setupMobileMenu() {
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}