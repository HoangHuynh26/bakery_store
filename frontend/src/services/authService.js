import { apiClient } from './apiClient';

export const authService = {
  login: async (email, password) => {
    const res = await apiClient.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (data) => {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  logout: async () => {
    const refreshToken = apiClient.getRefreshToken();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => {});
    }
    apiClient.clearTokens();
  },

  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  getProfile: async () => {
    const res = await apiClient.get('/users/profile');
    return res.data;
  },

  updateProfile: async (data) => {
    const res = await apiClient.put('/users/profile', data);
    return res.data;
  },

  changePassword: async (currentPassword, newPassword) => {
    const res = await apiClient.post('/users/password', { currentPassword, newPassword });
    return res.data;
  },

  getAddresses: async () => {
    const res = await apiClient.get('/users/addresses');
    return res.data;
  },

  addAddress: async (data) => {
    const res = await apiClient.post('/users/addresses', data);
    return res.data;
  },

  updateAddress: async (id, data) => {
    const res = await apiClient.put(`/users/addresses/${id}`, data);
    return res.data;
  },

  deleteAddress: async (id) => {
    const res = await apiClient.delete(`/users/addresses/${id}`);
    return res.data;
  },

  setDefaultAddress: async (id) => {
    const res = await apiClient.put(`/users/addresses/${id}/default`);
    return res.data;
  },
};
