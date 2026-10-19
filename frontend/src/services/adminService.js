import { apiClient } from './apiClient';

export const adminService = {
  // Analytics & Dashboard
  getDashboardSummary: async () => {
    const res = await apiClient.get('/admin/dashboard/summary');
    return res.data;
  },

  getLowStockAlerts: async (threshold = 10) => {
    const res = await apiClient.get(`/admin/dashboard/low-stock?threshold=${threshold}`);
    return res.data;
  },

  // Catalog & Products
  getAdminProducts: async ({ page = 0, size = 20, search = '', categorySlug = '', activeOnly = false } = {}) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (search) params.set('search', search);
    if (categorySlug) params.set('categorySlug', categorySlug);
    if (activeOnly) params.set('activeOnly', 'true');
    const res = await apiClient.get(`/admin/products?${params.toString()}`);
    return res.data;
  },

  getProductById: async (id) => {
    const res = await apiClient.get(`/admin/products/${id}`);
    return res.data;
  },

  createProduct: async (productData) => {
    const res = await apiClient.post('/admin/products', productData);
    return res.data;
  },

  updateProduct: async (id, productData) => {
    const res = await apiClient.put(`/admin/products/${id}`, productData);
    return res.data;
  },

  toggleProductStatus: async (id) => {
    const res = await apiClient.patch(`/admin/products/${id}/status`, {});
    return res.data;
  },

  updateStock: async (id, quantity) => {
    const res = await apiClient.patch(`/admin/products/${id}/stock?quantity=${quantity}`, {});
    return res.data;
  },

  // Categories
  getAdminCategories: async () => {
    const res = await apiClient.get('/admin/categories');
    return res.data;
  },

  createCategory: async (categoryData) => {
    const res = await apiClient.post('/admin/categories', categoryData);
    return res.data;
  },

  updateCategory: async (id, categoryData) => {
    const res = await apiClient.put(`/admin/categories/${id}`, categoryData);
    return res.data;
  },

  // Order Operations & Kitchen
  getAdminOrders: async ({ page = 0, size = 20, status = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (status && status !== 'ALL') params.set('status', status);
    const res = await apiClient.get(`/admin/orders?${params.toString()}`);
    return res.data;
  },

  getKitchenQueue: async () => {
    const res = await apiClient.get('/admin/orders/kitchen-queue');
    return res.data;
  },

  updateOrderStatus: async (id, status, comment = '') => {
    const res = await apiClient.patch(`/admin/orders/${id}/status`, { status, comment });
    return res.data;
  },

  updateOrderNotes: async (id, internalNotes) => {
    const res = await apiClient.patch(`/admin/orders/${id}/notes`, { internalNotes });
    return res.data;
  },

  // Customer Management
  getAdminCustomers: async ({ page = 0, size = 20, search = '' } = {}) => {
    const params = new URLSearchParams();
    params.set('page', page);
    params.set('size', size);
    if (search) params.set('search', search);
    const res = await apiClient.get(`/admin/customers?${params.toString()}`);
    return res.data;
  },

  // Export CSV
  downloadOrdersCsv: async () => {
    const token = localStorage.getItem('maison_access_token');
    const res = await fetch('/api/v1/admin/dashboard/export/orders.csv', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maison_douce_orders_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  downloadInventoryCsv: async () => {
    const token = localStorage.getItem('maison_access_token');
    const res = await fetch('/api/v1/admin/dashboard/export/inventory.csv', {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maison_douce_inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },
};
