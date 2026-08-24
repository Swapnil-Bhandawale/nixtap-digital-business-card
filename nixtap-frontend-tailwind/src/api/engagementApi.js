import { apiClient } from './axios';

export const engagementApi = {
  getLeads: async (cardId) => {
    const response = await apiClient.get(`/cards/${cardId}/leads`);
    return response.data;
  },
  getAppointments: async (cardId) => {
    const response = await apiClient.get(`/cards/${cardId}/appointments`);
    return response.data;
  },
  updateAppointmentStatus: async (cardId, apptId, status) => {
    const response = await apiClient.put(`/cards/${cardId}/appointments/${apptId}`, { status });
    return response.data;
  },
  getFeedback: async (cardId) => {
    const response = await apiClient.get(`/cards/${cardId}/feedback`);
    return response.data;
  }
};
