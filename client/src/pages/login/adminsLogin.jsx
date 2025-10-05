import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAPI } from "../../configs/api";
import Logo from "../../assets/logo.png";
function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Clear any localStorage data on component mount
    React.useEffect(() => {
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("permissions");
        localStorage.removeItem("adminUser");
    }, []);

    // Helper to check role and redirect accordingly
    const handleRoleRedirect = (admin) => {
        if (admin.role === "superadmin") {
            navigate("/dashboard/super-admin");
        } else if (admin.role === "admin") {
            navigate("/dashboard/sub-admin");
        } else {
            setError("Unauthorized role. Access denied.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await AdminAPI.login({ email, password });
            const admin = res.data.admin;
            const token = res.data.token;
            
            // Clear any previous data that might be interfering
            localStorage.clear();
            sessionStorage.clear();
            
            // Store fresh admin data and token in sessionStorage
            sessionStorage.setItem("adminUser", JSON.stringify(admin));
            if (token) {
                sessionStorage.setItem("authToken", token);
            
            } else {
                console.error('Client - No token received in response');
            }
            
            // Trigger auth state update
            window.dispatchEvent(new Event("authChange"));
            
            handleRoleRedirect(admin);
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-8">
            {/* Main Container */}
            <div className="w-full max-w-md p-6 sm:p-8 rounded-2xl shadow-2xl bg-white border border-blue-100 relative">
                
                {/* Logo and Header Section */}
                <div className="flex flex-col items-center mb-6 sm:mb-8">
                    <img 
                        src={Logo}
                        alt="Admin Logo" 
                        className="w-12 h-12 sm:w-16 sm:h-16 mb-2 sm:mb-3" 
                    />
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-1 sm:mb-2 tracking-tight text-center">
                        Admins Portal
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm text-center">
                        Sign in to your admins account
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1 sm:mb-2">
                            Email
                        </label>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="admin@email.com"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1 sm:mb-2">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            required
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-xs sm:text-sm text-center font-medium px-2 py-2 bg-red-50 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 sm:py-3 text-sm sm:text-base rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Logging in...
                            </span>
                        ) : (
                            'Login'
                        )}
                    </button>
                </form>

                {/* Footer Copyright */}
                <div className="absolute bottom-2 sm:bottom-3 right-3 sm:right-4 text-xs text-gray-300 select-none">
                    © {new Date().getFullYear()} RICR
                </div>
            </div>
        </div>
    );
}

export default AdminLogin;