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

    // Submit payment with screenshot
    submitPayment: (formData) => api.post('/auth/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 10000, // 10s for heavy uploads

    }),
    // Get payment by ID
    getPaymentById: (paymentId) => api.get(`/auth/payment/${paymentId}`),

};

// User API functions
export const userAPI = {

    // General user operations
    getUserById: (userId) => api.get(`/user/${userId}`),

    // Leader profile and team data
    getLeaderProfile: () => api.get('/user/leader/profile'),

    // Team member management by leader
    addMember: (memberData) => api.post('/user/leader/add-member', memberData),
    removeMember: (memberData) => api.delete('/user/leader/remove-member', { data: memberData }),
    editMember: (memberId, memberData) => api.put(`/user/leader/edit-member/${memberId}`, memberData),

    // Update terms accepted
    updateTermsAccepted: () => api.put('/user/update-terms', { termsAccepted: true }),

    //update theme selection
    updateThemeSelection: (teamId, themeName) => api.put(`/theme/select/${teamId}`, { themeName }),

    // Activate all themes (SuperAdmin)
    activateAllThemes: () => api.patch('/theme/activate-all'),

    // Deactivate all themes (SuperAdmin)
    deactivateAllThemes: () => api.patch('/theme/deactivate-all'),

    // Get all themes for admin (active + inactive)
    getAllThemesAdmin: () => api.get('/theme/admin/all'),

    // Get results for user's team
    getResult: () => api.get('/user/result'),

};

export const projectThemeAPI = {
    // Fetch all active themes (for users)
    getAllThemes: () => api.get('/theme'),
    // Fetch all themes for admin (active + inactive)
    getAllThemesAdmin: () => api.get('/theme/admin/all'),
    // Select a theme for a team
    selectThemeForTeam: (teamId, themeName) => api.put(`/theme/select/${teamId}`, { themeName }),
    // Granular payment management actions
    getAllPayments: () => api.get('/s/admin/payments'), // seePaymentStats
    getPaymentStats: () => api.get('/s/admin/payment-stats'), // seePaymentStats (if separate)
    getPaymentById: (paymentId) => api.get(`/s/admin/payment/${paymentId}`), // viewPaymentDetails
    reviewPayment: (paymentId, reviewData) => api.post(`/s/admin/reviewPayment/${paymentId}`, reviewData), // reviewPayments
    verifyPayment: (paymentId) => api.post(`/s/admin/verifyPayment/${paymentId}`), // verifyPayments
    rejectPayment: (paymentId, reason) => api.post(`/s/admin/rejectPayment/${paymentId}`, { reason }), // rejectPayments
    // Deactivate all themes (SuperAdmin)
    // Activate all themes (SuperAdmin)
    activateAllThemes: () => api.patch('/theme/activate-all'),
    // Deactivate all themes (SuperAdmin)
    deactivateAllThemes: () => api.patch('/theme/deactivate-all'),
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

    // Get active problem statements for team (filtered by team's theme)
    getActiveForTeam: (teamId) => api.get(`/problem/team/${teamId}/problemstatements`),
    // Team selects a problem statement
    selectForTeam: (teamId, problemStatementId) => api.post('/problem/team/select-problem', { teamId, problemStatementId }),
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


    // Deactivate all problem statements (SuperAdmin)
    deactivateAllProblemStatements: () => api.patch('/problem/deactivate-all'),
    // Activate all problem statements (SuperAdmin) 
    activateAllProblemStatements: () => api.patch('/problem/activate-all'),
    



       // payment
    getAllPayments: () => api.get('/admin/payments'),
    getPaymentById: (paymentId) => api.get(`/admin/payment/${paymentId}`),
    // Accepts optional body for status/rejectionMessage
    verifyPayment: (paymentId, body = {}) => api.post(`/admin/verifyPayment/${paymentId}`, body),

};

//super admin
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
    getAllAdmins: () => api.get('/s/admin/admins'),


    // Result routes
    getResultsWithTeamAndLeader: () => api.get('/s/admin/all-with-team-leader'),
    exportResultsExcel: () => api.get('/s/admin/export-excel', { responseType: 'blob' }),
    createResult: (data) => api.post('/s/admin/result', data),
    updateResult: (id, data) => api.put(`/s/admin/result/${id}`, data),
    deleteResult: (id) => api.delete(`/s/admin/result/${id}`),
    deleteAllResults: () => api.delete('/s/admin/result/all/delete-all'),
    importResultsExcel: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/s/admin/import-excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    declareAllResults: () => api.patch('/s/admin/declare-results'),

    // payment
    getAllPayments: () => api.get('/s/admin/payments'),
    getPaymentById: (paymentId) => api.get(`/s/admin/payment/${paymentId}`),
    verifyPayment: (paymentId) => api.post(`/s/admin/verifyPayment/${paymentId}`),


};


export const resultAPI = {
    getResultsWithTeamAndLeader: () => api.get('/result/all-with-team-leader'),
    createResult: (data) => api.post('/result', data),
    updateResult: (id, data) => api.put(`/result/${id}`, data),
    deleteResult: (id) => api.delete(`/result/${id}`),
    deleteAllResults: () => api.delete('/result/all/delete-all'),
    exportExcel: () => api.get('/result/export-excel', { responseType: 'blob' }),
    importExcel: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/result/import-excel', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    declareAllResults: () => api.patch('/result/declare-results'),
};


export const homeAPI = {
    // Fetch all active themes (for home page)
    getAllThemes: () => api.get('/home'),
};


export const accomodationAPI = {
    // Create a new accomodation booking
    createAccomodation: (data) => api.post('/accomodations', data),
    // Get all accomodation bookings (optionally filter by teamid)
    getAllAccomodations: (params) => api.get('/accomodations', { params }),
    // Get a single accomodation by id
    getAccomodationById: (id) => api.get(`/accomodations/${id}`),
    // Update an accomodation by id
    updateAccomodation: (id, data) => api.put(`/accomodations/${id}`, data),
    // Delete an accomodation by id
    deleteAccomodation: (id) => api.delete(`/accomodations/${id}`),
};


export default api;