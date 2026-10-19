import { apiClient } from './apiClient';

export const cartService = {
  getCart: async () => {
    const res = await apiClient.get('/carts');
    return res.data;
  },

  addItem: async (productId, variantId = null, quantity = 1, customizationNotes = null) => {
    const res = await apiClient.post('/carts/items', {
      productId,
      variantId,
      quantity,
      customizationNotes,
    });
    return res.data;
  },

  updateItem: async (itemId, quantity, customizationNotes = null) => {
    const res = await apiClient.put(`/carts/items/${itemId}`, {
      quantity,
      customizationNotes,
    });
    return res.data;
  },

  removeItem: async (itemId) => {
    const res = await apiClient.delete(`/carts/items/${itemId}`);
    return res.data;
  },

  clearCart: async () => {
    const res = await apiClient.delete('/carts/clear');
    return res.data;
  },

  mergeCart: async (sessionToken) => {
    const res = await apiClient.post('/carts/merge', { sessionToken });
    return res.data;
  },
};
