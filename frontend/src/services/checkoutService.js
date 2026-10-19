import { apiClient } from './apiClient';

export const checkoutService = {
  getDeliveryZones: async () => {
    const res = await apiClient.get('/delivery/zones');
    return res.data;
  },

  getDeliverySlots: async () => {
    const res = await apiClient.get('/delivery/slots');
    return res.data;
  },

  validateCoupon: async (code, cartSubtotal) => {
    const res = await apiClient.post('/promotions/coupons/validate', {
      code,
      cartSubtotal,
    });
    return res.data;
  },

  submitCheckout: async (checkoutPayload) => {
    const res = await apiClient.post('/checkout', checkoutPayload);
    return res.data;
  },

  getOrderByNumber: async (orderNumber) => {
    const res = await apiClient.get(`/orders/${orderNumber}`);
    return res.data;
  },

  getOrderTracking: async (orderNumber) => {
    const res = await apiClient.get(`/orders/${orderNumber}/tracking`);
    return res.data;
  },

  getCustomerOrders: async () => {
    const res = await apiClient.get('/orders/customer');
    return res.data;
  },
};
