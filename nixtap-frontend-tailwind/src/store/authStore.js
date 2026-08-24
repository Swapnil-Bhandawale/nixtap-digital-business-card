import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('nixtap_token') || null,
  isAuthenticated: !!localStorage.getItem('nixtap_token'),
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const apiResponse = await authApi.login(credentials);
      const data = apiResponse.data;
      localStorage.setItem('nixtap_token', data.token);
      // Set the token first so the API client has it
      set({ token: data.token, isAuthenticated: true });
      // Fetch the full user profile from /users/me so avatar and phone are loaded
      await get().fetchUser();
      // fetchUser handles setting isLoading to false
    } catch (error) {
      console.error("Login error:", error);
      let errorMsg = 'Login failed. Please try again.';
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Unable to connect to the server. Please make sure the backend is running.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const apiResponse = await authApi.register(userData);
      const data = apiResponse.data || {};
      
      // If backend returns a token immediately (e.g. OTP disabled), log them in
      if (data.token) {
        localStorage.setItem('nixtap_token', data.token);
        set({ token: data.token, isAuthenticated: true });
        await get().fetchUser();
      } else {
        // Just clear loading state, do NOT set authenticated because they need OTP
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Registration error:", error);
      let errorMsg = 'Registration failed. Please try again.';
      if (error.code === 'ERR_NETWORK') {
        errorMsg = 'Unable to connect to the server. Please make sure the backend is running.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      set({ error: errorMsg, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('nixtap_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    const isFirstLoad = !get().user;
    if (isFirstLoad) {
      set({ isLoading: true });
    }
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      localStorage.removeItem('nixtap_token');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  }
}));
