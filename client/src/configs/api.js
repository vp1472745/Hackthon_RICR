import axios from 'axios';

const BASE_URL = 'http://localhost:4500/api';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API functions
export const authAPI = {
    // Step 1: Register user
    registerUser: (userData) => api.post('/auth/register', userData),
    
    // Step 2: OTP functions
    sendEmailOtp: (email) => api.post('/auth/send-email-otp', { email }),
    sendPhoneOtp: (phone) => api.post('/auth/send-phone-otp', { phone }),
    verifyEmailOtp: (email, otp) => api.post('/auth/verify-email-otp', { email, otp }),
    verifyPhoneOtp: (phone, otp) => api.post('/auth/verify-phone-otp', { phone, otp }),
    
    // Step 3: Complete registration
    completeRegistration: (data) => api.post('/auth/complete-registration', data),
    
    // Get user status
    getUserStatus: (email) => api.get(`/auth/user/${encodeURIComponent(email)}`)
};

export default api;
