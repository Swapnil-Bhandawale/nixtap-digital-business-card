import { apiClient } from './axios';

export const analyticsApi = {
  getAnalytics: async (cardId, days = 7) => {
    const response = await apiClient.get(`/cards/${cardId}/analytics`, {
      params: { days }
    });
    return response.data;
  }
};
