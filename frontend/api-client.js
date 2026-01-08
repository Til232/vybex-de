// API client for VYBEX multi-brand shop

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = {
  // ========== BRANDS ==========
  brands: {
    async create(brandData, logoFile) {
      const formData = new FormData();
      formData.append('name', brandData.name);
      formData.append('description', brandData.description);
      formData.append('color_primary', brandData.color_primary);
      formData.append('color_secondary', brandData.color_secondary);
      if (logoFile) formData.append('logo', logoFile);

      const response = await fetch(`${API_BASE}/brands`, {
        method: 'POST',
        body: formData
      });
      return response.json();
    },

    async getAll() {
      const response = await fetch(`${API_BASE}/brands`);
      return response.json();
    },

    async getBySlug(slug) {
      const response = await fetch(`${API_BASE}/brands/${slug}`);
      return response.json();
    },

    async update(id, brandData, logoFile) {
      const formData = new FormData();
      Object.entries(brandData).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });
      if (logoFile) formData.append('logo', logoFile);

      const response = await fetch(`${API_BASE}/brands/${id}`, {
        method: 'PUT',
        body: formData
      });
      return response.json();
    },

    async delete(id) {
      const response = await fetch(`${API_BASE}/brands/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    }
  },

  // ========== PRODUCTS ==========
  products: {
    async create(productData, imageFiles) {
      const formData = new FormData();
      formData.append('brand_id', productData.brand_id);
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('sku', productData.sku);
      formData.append('stock_quantity', productData.stock_quantity);
      formData.append('is_featured', productData.is_featured);

      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formData.append('images', file);
          if (productData[`alt_text_${index}`]) {
            formData.append(`alt_text_${index}`, productData[`alt_text_${index}`]);
          }
        });
      }

      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        body: formData
      });
      return response.json();
    },

    async getByBrand(brandId) {
      const response = await fetch(`${API_BASE}/products/brand/${brandId}`);
      return response.json();
    },

    async getById(id) {
      const response = await fetch(`${API_BASE}/products/${id}`);
      return response.json();
    },

    async update(id, productData, imageFiles) {
      const formData = new FormData();
      Object.entries(productData).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      if (imageFiles && imageFiles.length > 0) {
        imageFiles.forEach((file, index) => {
          formData.append('images', file);
        });
      }

      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        body: formData
      });
      return response.json();
    },

    async delete(id) {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      return response.json();
    }
  }
};
