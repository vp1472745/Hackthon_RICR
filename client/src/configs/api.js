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
    // Step 1: Send OTP (first step - sends both email and phone OTP)
    sendOTP: (userData) => api.post('/auth/sendOTP', userData),
    
    // Step 2: Verify OTPs and Register (completes registration with OTP verification)
    register: (registrationData) => api.post('/auth/register', registrationData),
    
    // Step 3: Login (team login with teamCode and email)
    login: (loginData) => api.post('/auth/login', loginData),
    
    // Logout
    logout: () => api.post('/auth/logout')
};

export default api;
