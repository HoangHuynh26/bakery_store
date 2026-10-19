import { apiClient } from './apiClient';

export const customCakeService = {
  // Customer bespoke cake operations
  createRequest: async (cakeData) => {
    const res = await apiClient.post('/custom-cakes', cakeData);
    return res.data;
  },

  getByRequestNumber: async (requestNumber) => {
    const res = await apiClient.get(`/custom-cakes/${requestNumber}`);
    return res.data;
  },

  getMyRequests: async () => {
    const res = await apiClient.get('/custom-cakes/my-requests');
    return res.data;
  },

  acceptQuotation: async (id) => {
    const res = await apiClient.patch(`/custom-cakes/${id}/accept`, {});
    return res.data;
  },

  rejectQuotation: async (id) => {
    const res = await apiClient.patch(`/custom-cakes/${id}/reject`, {});
    return res.data;
  },

  // Admin bespoke cake operations
  getAdminCustomCakes: async ({ page = 0, size = 15, status = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (status && status !== 'ALL') params.set('status', status);
    const res = await apiClient.get(`/admin/custom-cakes?${params.toString()}`);
    return res.data;
  },

  submitQuotation: async (id, { quotationAmount, adminNotes }) => {
    const res = await apiClient.patch(`/admin/custom-cakes/${id}/quotation`, {
      quotationAmount,
      adminNotes,
    });
    return res.data;
  },

  updateRequestStatus: async (id, status) => {
    const res = await apiClient.patch(`/admin/custom-cakes/${id}/status`, { status });
    return res.data;
  },

  // Admin raw ingredients & inventory
  getIngredients: async () => {
    const res = await apiClient.get('/admin/inventory/ingredients');
    return res.data;
  },

  adjustStock: async ({ ingredientId, quantity, movementType, reason }) => {
    const res = await apiClient.post('/admin/inventory/adjust', {
      ingredientId,
      quantity,
      movementType,
      reason,
    });
    return res.data;
  },

  getMovements: async () => {
    const res = await apiClient.get('/admin/inventory/movements');
    return res.data;
  },
};
