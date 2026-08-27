import { apiClient } from './axios';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  me: async () => {
    const response = await apiClient.get('/users/me');
    return response.data?.data;
  },
  
  verifyOtp: async (data) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  resendOtp: async (data) => {
    const response = await apiClient.post('/auth/resend-otp', data);
    return response.data;
  },

  forgotPassword: async (data) => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  startTrial: async () => {
    const response = await apiClient.post('/users/me/start-trial');
    return response.data?.data;
  }
};
