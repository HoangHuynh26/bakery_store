import { apiClient } from './apiClient';

/**
 * Maison Douce Bakery - Retention, Reviews, Loyalty & Concierge Service
 */
export const retentionService = {
  /**
   * Get approved customer reviews & rating summary for a product
   */
  getProductReviews: async (productId) => {
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response.data;
  },

  /**
   * Get featured 5-star customer reviews for homepage
   */
  getFeaturedReviews: async () => {
    const response = await apiClient.get('/reviews/featured');
    return response.data;
  },

  /**
   * Submit a product review (authenticated)
   */
  submitProductReview: async (reviewData) => {
    const response = await apiClient.post('/reviews', reviewData);
    return response.data;
  },

  /**
   * Get current authenticated user's loyalty account & tier info
   */
  getMyLoyaltyAccount: async () => {
    const response = await apiClient.get('/loyalty/me');
    return response.data;
  },

  /**
   * Get all loyalty tiers and privileges
   */
  getLoyaltyTiers: async () => {
    const response = await apiClient.get('/loyalty/tiers');
    return response.data;
  },

  /**
   * Query the Boutique Concierge rule engine
   */
  askConcierge: async (message) => {
    const response = await apiClient.post('/support/faq-chat', { message });
    return response.data;
  },

  /**
   * Submit an inquiry support ticket
   */
  submitSupportTicket: async (ticketData) => {
    const response = await apiClient.post('/support/tickets', ticketData);
    return response.data;
  },

  /**
   * Get user support tickets
   */
  getMySupportTickets: async () => {
    const response = await apiClient.get('/support/my-tickets');
    return response.data;
  },
};

export default retentionService;
