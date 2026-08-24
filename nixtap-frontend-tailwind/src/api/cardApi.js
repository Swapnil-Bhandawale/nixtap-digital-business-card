import { apiClient } from './axios';

export const cardApi = {
  getCards: async () => {
    const response = await apiClient.get('/cards');
    return response.data;
  },
  
  getCard: async (id) => {
    const response = await apiClient.get(`/cards/${id}`);
    return response.data;
  },
  
  createCard: async (data) => {
    const response = await apiClient.post('/cards', data);
    return response.data;
  },
  
  updateCard: async (id, data) => {
    const response = await apiClient.put(`/cards/${id}`, data);
    return response.data;
  },
  
  deleteCard: async (id) => {
    const response = await apiClient.delete(`/cards/${id}`);
    return response.data;
  },
  
  getSocialLinks: async (cardId) => {
    const response = await apiClient.get(`/cards/${cardId}/social-links`);
    return response.data;
  },
  
  addSocialLink: async (cardId, data) => {
    const response = await apiClient.post(`/cards/${cardId}/social-links`, data);
    return response.data;
  },
  
  deleteSocialLink: async (cardId, linkId) => {
    const response = await apiClient.delete(`/cards/${cardId}/social-links/${linkId}`);
    return response.data;
  },

  getPublicCard: async (slugOrId) => {
    const response = await apiClient.get(`/public/cards/${slugOrId}`);
    return response.data;
  }
};
