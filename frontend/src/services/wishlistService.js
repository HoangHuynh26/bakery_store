import { apiClient } from './apiClient';

export const wishlistService = {
  getWishlist: async () => {
    const res = await apiClient.get('/wishlists');
    return res.data;
  },

  toggleWishlist: async (productId) => {
    const res = await apiClient.post(`/wishlists/${productId}`);
    return res.data;
  },

  removeFromWishlist: async (productId) => {
    const res = await apiClient.delete(`/wishlists/${productId}`);
    return res.data;
  },
};
