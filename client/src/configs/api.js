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

// Custom permission modal handler (set by components)
let showGlobalPermissionModal = null;

export function setGlobalPermissionModalHandler(fn) {
    showGlobalPermissionModal = fn;
}

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            sessionStorage.removeItem('authToken');
            sessionStorage.removeItem('hackathonUser');
            window.location.href = '/login';
        } else if (error.response?.status === 403 && typeof showGlobalPermissionModal === 'function') {
            showGlobalPermissionModal();
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
    logout: () => api.post('/auth/logout'),
    // Refresh user data
    refreshData: () => api.get('/auth/refresh'),

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
    updateThemeSelection: (teamId, themeName) => api.put(`/theme/select/${teamId}`, { themeName }),
    // Refresh user data
   
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


export const AdminAPI = {
    // Fetch admin by email (for live permission updates)
    getByEmail: (email) => api.get(`/admin/admin-by-email?email=${encodeURIComponent(email)}`),
    getAllUsers: () => api.get('/admin/users'),
    getAllTeams: () => api.get('/admin/teamsWithMembers'),


    // Two-step admin registration
    sendAdminOTP: (data) => api.post('admin/sendAdminOTP', data),
    verifyAdminOTP: (data) => api.post('admin/verifyAdminOTP', data),


// router.post("/register", registerAdmin);
registerAdmin: (adminData) => api.post('/admin/register', adminData),


// router.post("/login", adminLogin);
login: (loginData) => api.post('/admin/login', loginData),
// router.post("/logout", authenticateAdmin, adminLogout);
logout: () => api.post('/admin/logout'),

teamsWithMembers: () => api.get('/admin/teamsWithMembers'),

createTheme: (themeData) => api.post('/admin/createTheme', themeData),


getAllThemes: () => api.get('/admin/themes'),
createProblemStatement: (data) => api.post('/admin/createProblemStatement', data),


getAllProblemStatementsAdmin: () => api.get('/admin/problemStatements'),

getAllUsers: () => api.get('/admin/users'),
getAllTeams: () => api.get('/admin/teamsWithMembers'),
editTheme: (id, data) => api.put(`/admin/editTheme/${id}`, data),
// router.delete("/deleteTheme/:id", deleteTheme);
deleteTheme: (id) => api.delete(`/admin/deleteTheme/${id}`),

editProblemStatement: (id, data) => api.put(`/admin/editProblemStatement/${id}`, data),
deleteProblemStatement: (id) => api.delete(`/admin/deleteProblemStatement/${id}`),


// router.post('/createProblemStatement', createProblemStatement);
createProblemStatement: (data) => api.post('/admin/createProblemStatement', data),

};


export const subAdminAPI = {
    // Admin permissions
    setAdminPermissions: (email, permissions) => api.put(`/s/admin/set-permissions/${email}`, { permissions }),
    getAdminPermissions: (email) => api.get(`/s/admin/admin-permissions/${email}`),
    
    // Theme routes
    createTheme: (data) => api.post('/s/admin/createTheme', data),
    getAllThemes: () => api.get('/s/admin/themes'),
    editTheme: (id, data) => api.put(`/s/admin/editTheme/${id}`, data),
    deleteTheme: (id) => api.delete(`/s/admin/deleteTheme/${id}`),
    
    // Problem Statement routes
    createProblemStatement: (data) => api.post('/s/admin/createProblemStatement', data),
    getAllProblemStatementsAdmin: () => api.get('/s/admin/problemStatements'),
    editProblemStatement: (id, data) => api.put(`/s/admin/editProblemStatement/${id}`, data),
    deleteProblemStatement: (id) => api.delete(`/s/admin/deleteProblemStatement/${id}`),
    
    // Teams and Users
    getAllTeams: () => api.get('/s/admin/teamsWithMembers'),
    getAllUsers: () => api.get('/s/admin/users'),
    
    // Admins
    getAllAdmins: () => api.get('/s/admin/admins')
};  




export default api;