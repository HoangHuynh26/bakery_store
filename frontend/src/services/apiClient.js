/**
 * Maison Douce Bakery - Native Fetch API Client
 * Built with standard Fetch API (no Axios), automatic Bearer auth header injection,
 * and transparent 401 token refresh rotation.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  getAccessToken() {
    return localStorage.getItem('maison_access_token');
  }

  getRefreshToken() {
    return localStorage.getItem('maison_refresh_token');
  }

  setTokens(accessToken, refreshToken) {
    if (accessToken) localStorage.setItem('maison_access_token', accessToken);
    if (refreshToken) localStorage.setItem('maison_refresh_token', refreshToken);
  }

  clearTokens() {
    localStorage.removeItem('maison_access_token');
    localStorage.removeItem('maison_refresh_token');
    localStorage.removeItem('maison_user');
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers,
    };

    const token = this.getAccessToken();
    if (token && !headers.Authorization) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized for token refresh
      if (response.status === 401 && !options._retry && this.getRefreshToken()) {
        if (this.isRefreshing) {
          return new Promise((resolve, reject) => {
            this.failedQueue.push({ resolve, reject });
          })
            .then((newToken) => {
              config.headers.Authorization = `Bearer ${newToken}`;
              return fetch(url, config).then(res => res.json());
            });
        }

        options._retry = true;
        this.isRefreshing = true;

        try {
          const refreshRes = await fetch(`${this.baseURL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: this.getRefreshToken() }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const { accessToken, refreshToken: newRefreshToken } = refreshData.data;
            this.setTokens(accessToken, newRefreshToken);
            this.processQueue(null, accessToken);
            config.headers.Authorization = `Bearer ${accessToken}`;
            return this.request(endpoint, options);
          } else {
            this.clearTokens();
            this.processQueue(new Error('Session expired, please login again'), null);
            window.dispatchEvent(new CustomEvent('maison:auth-expired'));
          }
        } catch (refreshErr) {
          this.clearTokens();
          this.processQueue(refreshErr, null);
          window.dispatchEvent(new CustomEvent('maison:auth-expired'));
        } finally {
          this.isRefreshing = false;
        }
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const error = new Error(data?.message || `HTTP Error ${response.status}`);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (err) {
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
