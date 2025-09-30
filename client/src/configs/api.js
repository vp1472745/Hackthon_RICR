import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


// Add request interceptor to include auth token
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiry
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('hackathonUser');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API functions
export const authAPI = {
    // Step 1: Send OTP (first step - sends both email and phone OTP)
    sendOTP: (userData) => api.post('/auth/sendOTP', userData),

    // Step 2: Verify OTPs and Register (completes registration with OTP verification)
    register: (registrationData) => api.post('/auth/register', registrationData),

    // Step 3: Login (team login with teamCode and email)
    login: (loginData) => api.post('/auth/login', loginData),

    // Send email with login details
    sendCredentials: (emailData) => api.post('/auth/sendCredentials', emailData),
    // Logout
    logout: () => api.post('/auth/logout')
};

// User API functions
export const userAPI = {

    // General user operations
    getUserById: (userId) => api.get(`/user/${userId}`),
   
    // Team member management by leader
    addMember: (memberData) => api.post('/user/leader/add-member', memberData),
    removeMember: (memberData) => api.delete('/user/leader/remove-member', { data: memberData }),
    editMember: (memberId, memberData) => api.put(`/user/leader/edit-member/${memberId}`, memberData),

    // Update terms accepted
    updateTermsAccepted: () => api.put('/user/update-terms', { termsAccepted: true }),

    //update theme selection
    updateThemeSelection: (teamId, themeName) => api.put(`/theme/select/${teamId}`, { themeName })

};

export const projectThemeAPI = {
    // Fetch all themes
    getAllThemes: () => api.get('/theme'),
    // Select a theme for a team
    selectThemeForTeam: (teamId, themeName) => api.put(`/theme/select/${teamId}`, { themeName }),
};


// Problem Statement API functions
export const problemStatementAPI = {
    // Get all problem statements for a theme
    getByTheme: (themeId) => api.get(`/problems?theme=${themeId}`),
    // Get all problem statements (optionally filtered by teamId)
    getAll: (params) => api.get('/problem', { params }),
    // Get all problem statements for a team
    getByTeam: (teamId) => api.get(`/problem/team/${teamId}`),
    // Create a new problem statement
    create: (data) => api.post('/problem/', data),
    // Edit a problem statement
    edit: (id, data) => api.put(`/problem/${id}`, data),
    // Delete a problem statement
    delete: (id) => api.delete(`/problemt/${id}`),
};






export default api;