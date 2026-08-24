import { apiClient } from './axios';

export const paymentApi = {
  createCheckout: (planName) => {
    return apiClient.post('/payment/checkout', { plan: planName });
  },
  verifyPayment: (verifyData) => {
    return apiClient.post('/payment/verify', verifyData);
  },
  loadRazorpay: () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }
};
