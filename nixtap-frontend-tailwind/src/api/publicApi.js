import { apiClient } from './axios';

export const publicApi = {
  getCard: async (slugOrId) => {
    const response = await apiClient.get(`/public/cards/${slugOrId}`);
    return response.data;
  },
  
  recordView: async (cardId) => {
    const response = await apiClient.post(`/public/cards/${cardId}/views`);
    return response.data;
  },
  
  recordShare: async (cardId) => {
    const response = await apiClient.post(`/public/cards/${cardId}/shares`);
    return response.data;
  },
  
  submitLead: async (cardId, data) => {
    const response = await apiClient.post(`/public/cards/${cardId}/leads`, data);
    return response.data;
  },
  
  bookAppointment: async (cardId, data) => {
    const response = await apiClient.post(`/public/cards/${cardId}/appointments`, data);
    return response.data;
  },
  
  submitFeedback: async (cardId, data) => {
    const response = await apiClient.post(`/public/cards/${cardId}/feedback`, data);
    return response.data;
  },

  getFeedbacks: async (cardId) => {
    const response = await apiClient.get(`/public/cards/${cardId}/feedback`);
    return response.data;
  }
};
