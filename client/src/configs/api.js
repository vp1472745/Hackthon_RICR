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
    // Step 1: Send OTP to user
    sendOTP: (userData) => api.post('/auth/SendOTP', userData),
    
    // Step 2: Register user with OTP verification
    register: (userData) => api.post('/auth/Register', userData),
    
    // Step 3: Login user
    login: (loginData) => api.post('/auth/login', loginData),
    
    // Step 4: Logout user
    logout: () => api.post('/auth/logout')
};

export default api;
