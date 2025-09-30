import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminAPI } from "../../configs/api";


function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    // Helper to check role and redirect accordingly
    const handleRoleRedirect = (admin) => {
        if (admin.role === "superadmin") {
            navigate("/dashboard/super-admin");
        } else if (admin.role === "admin") {
            navigate("/dashboard/admin");
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
            // Store admin info in sessionStorage
            sessionStorage.setItem("adminUser", JSON.stringify(admin));
            handleRoleRedirect(admin);
        }
        catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || "Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
            <h2 className="text-lg font-semibold mb-4 text-center">Admin Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        type="password"
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-blue-500"
                    />
                </div>
                {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
                <button type="submit"    disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default AdminLogin;