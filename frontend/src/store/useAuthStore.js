import { create } from 'zustand';
import { apiClient } from '../services/apiClient';
import { authService } from '../services/authService';
import { cartService } from '../services/cartService';

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

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const data = await authService.login(email, password);
      get().setAuth(data.user, data.accessToken, data.refreshToken);

      // Merge guest cart if guest session existed
      const guestSessionToken = localStorage.getItem('maison_session_token');
      if (guestSessionToken) {
        try {
          await cartService.mergeCart(guestSessionToken);
          // Cart merged, clear guest session token
          apiClient.clearSessionToken();
        } catch {
          // Ignore merge failure if guest cart was empty
        }
      }

      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (form) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(form);
      get().setAuth(data.user, data.accessToken, data.refreshToken);
      return data;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout().catch(() => {});
    } finally {
      apiClient.clearTokens();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  updateUser: (updatedUser) => {
    localStorage.setItem('maison_user', JSON.stringify(updatedUser));
    set({ user: updatedUser });
  },

  refreshUserProfile: async () => {
    if (!get().isAuthenticated) return null;
    try {
      const profile = await authService.getProfile();
      get().updateUser(profile);
      return profile;
    } catch {
      return null;
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
    return (
      user.roles.includes('ROLE_STAFF') ||
      user.roles.includes('ROLE_ADMIN') ||
      user.roles.includes('ROLE_SUPER_ADMIN')
    );
  },
}));

// Listen for global auth expiration events from apiClient
if (typeof window !== 'undefined') {
  window.addEventListener('maison:auth-expired', () => {
    useAuthStore.getState().logout();
  });
}
