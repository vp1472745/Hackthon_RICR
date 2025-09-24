import axios from 'axios';

const BASE_URL = 'http://localhost:4500/api';

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
        const token = localStorage.getItem('authToken');
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
            localStorage.removeItem('authToken');
            localStorage.removeItem('hackathonUser');
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
    
    // Logout
    logout: () => api.post('/auth/logout')
};

// User API functions
export const userAPI = {
    // General user operations
    getUserById: (userId) => api.get(`/user/${userId}`),
    getAllUsers: (params) => api.get('/user/all', { params }),
    updateUser: (userId, userData) => api.put(`/user/update/${userId}`, userData),
    deleteUser: (userId) => api.delete(`/user/delete/${userId}`),
    
    // Leader profile operations
    getLeaderProfile: () => api.get('/user/leader/profile'),
    updateLeaderProfile: (profileData) => api.put('/user/leader/profile', profileData),
    deleteLeaderProfile: () => api.delete('/user/leader/profile'),
    
    // Team member management by leader
    addMember: (memberData) => api.post('/user/leader/add-member', memberData),
    removeMember: (memberData) => api.delete('/user/leader/remove-member', { data: memberData }),
    editMember: (memberId, memberData) => api.put(`/user/leader/edit-member/${memberId}`, memberData),
    
    // Member profile operations
    getMemberProfile: () => api.get('/user/member/profile'),
    
    // Team operations
    getTeamProfile: (teamId) => api.get(`/user/team/${teamId}/profile`),
    getTeamStats: (teamId) => api.get(`/user/team/${teamId}/stats`)
};

// Team API functions (for future use)
export const teamAPI = {
    // Get team details
    getTeamDetails: (teamId) => api.get(`/team/${teamId}`),
    
    // Update team information
    updateTeam: (teamId, teamData) => api.put(`/team/${teamId}`, teamData)
};

export default api;
