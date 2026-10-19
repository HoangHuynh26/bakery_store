import { apiClient } from './apiClient';

export const catalogService = {
  /**
   * Fetch all active categories
   */
  async getCategories() {
    const res = await apiClient.get('/categories');
    return res.data;
  },

  /**
   * Fetch category details by slug
   */
  async getCategoryBySlug(slug) {
    const res = await apiClient.get(`/categories/${slug}`);
    return res.data;
  },

  /**
   * Fetch products with dynamic filters and pagination
   */
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) query.append('category', params.category);
    if (params.q) query.append('q', params.q);
    if (params.minPrice) query.append('minPrice', params.minPrice);
    if (params.maxPrice) query.append('maxPrice', params.maxPrice);
    if (params.dietaryTag) query.append('dietaryTag', params.dietaryTag);
    if (params.featured) query.append('featured', 'true');
    if (params.inStock) query.append('inStock', 'true');
    if (params.sort) query.append('sort', params.sort);
    query.append('page', params.page || 0);
    query.append('size', params.size || 12);

    const res = await apiClient.get(`/products?${query.toString()}`);
    return res;
  },

  /**
   * Fetch complete product details by slug or UUID
   */
  async getProduct(identifier) {
    const res = await apiClient.get(`/products/${identifier}`);
    return res.data;
  },

  /**
   * Fetch featured bestsellers
   */
  async getFeaturedProducts() {
    const res = await apiClient.get('/products/featured');
    return res.data;
  },

  /**
   * Fetch autocomplete suggestions
   */
  async getSearchSuggestions(query) {
    if (!query || query.trim().length < 2) return [];
    const res = await apiClient.get(`/products/search/suggestions?q=${encodeURIComponent(query)}`);
    return res.data;
  },

  /**
   * Fetch related products
   */
  async getRelatedProducts(productId, limit = 4) {
    const res = await apiClient.get(`/products/${productId}/related?limit=${limit}`);
    return res.data;
  },
};
