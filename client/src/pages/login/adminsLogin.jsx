import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAPI } from "../../configs/api";



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
            navigate("/dashboard/sadmin");
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
            
            // Clear any previous localStorage data that might be interfering
            localStorage.removeItem("adminEmail");
            localStorage.removeItem("permissions");
            localStorage.removeItem("adminUser");
            
            // Store admin data in sessionStorage only
            sessionStorage.setItem("adminUser", JSON.stringify(admin));
            handleRoleRedirect(admin);
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-blue-100 relative">
                <div className="flex flex-col items-center mb-6">
                    <img src="/public/logo.png" alt="Admin Logo" className="w-16 h-16 mb-2" />
                    <h2 className="text-2xl font-bold text-blue-800 mb-1 tracking-tight">Admins Portal</h2>
                    <p className="text-gray-500 text-sm">Sign in to your admins account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">Email</label>
                        <input
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            type="email"
                            required
                            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="admin@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">Password</label>
                        <input
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            type="password"
                            required
                            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <div className="text-red-500 text-sm text-center font-medium">{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="absolute bottom-3 right-4 text-xs text-gray-300 select-none">© {new Date().getFullYear()} RICR</div>
            </div>
        </div>
    );
}

export default AdminLogin;