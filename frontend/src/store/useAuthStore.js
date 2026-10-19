import { create } from 'zustand';
import { apiClient } from '../services/apiClient';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('maison_user') || 'null'),
  accessToken: localStorage.getItem('maison_access_token') || null,
  isAuthenticated: !!localStorage.getItem('maison_access_token'),
  isLoading: false,

  setAuth: (user, accessToken, refreshToken) => {
    apiClient.setTokens(accessToken, refreshToken);
    localStorage.setItem('maison_user', JSON.stringify(user));
    set({
      user,
      accessToken,
      isAuthenticated: true,
    });
  },

  logout: async () => {
    try {
      const refreshToken = apiClient.getRefreshToken();
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken }).catch(() => {});
      }
    } finally {
      apiClient.clearTokens();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  hasRole: (role) => {
    const user = get().user;
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  },

  isAdmin: () => {
    const user = get().user;
    if (!user || !user.roles) return false;
    return user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN');
  },

  isStaff: () => {
    const user = get().user;
    if (!user || !user.roles) return false;
    return user.roles.includes('ROLE_STAFF') || user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_SUPER_ADMIN');
  },
}));

// Listen for global auth expiration events from apiClient
if (typeof window !== 'undefined') {
  window.addEventListener('maison:auth-expired', () => {
    useAuthStore.getState().logout();
  });
}
