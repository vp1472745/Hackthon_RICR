import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leaderName, setLeaderName] = useState("");
  const [userRole, setUserRole] = useState(""); // 'Leader' or 'Member'
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminType, setAdminType] = useState(""); // 'admin' or 'superadmin'

  // Safely parse JSON from sessionStorage
  const getUserData = () => {
    try {
      return JSON.parse(sessionStorage.getItem("hackathonUser"));
    } catch {
      return null;
    }
  };

  // Safely parse admin data from sessionStorage
  const getAdminData = () => {
    try {
      return JSON.parse(sessionStorage.getItem("adminUser"));
    } catch {
      return null;
    }
  };

  // Update auth state
  const updateAuthState = () => {
    // Check normal user authentication
    const userData = getUserData();
    if (userData?.user && sessionStorage.getItem("authToken")) {
      setIsAuthenticated(true);
      setLeaderName(userData.user.fullName || userData.user.name || "");
      setUserRole(userData.user.role || "");
    } else {
      setIsAuthenticated(false);
      setLeaderName("");
      setUserRole("");
    }

    // Check admin authentication
    const adminData = getAdminData();
    const adminToken = sessionStorage.getItem("adminAuthToken") || sessionStorage.getItem("authToken");
    
    if (adminData && adminToken) {
      setIsAdminAuthenticated(true);
      setAdminEmail(adminData.email || adminData.admin?.email || "");
      setAdminType(adminData.role || adminData.admin?.role || "admin");
    } else {
      setIsAdminAuthenticated(false);
      setAdminEmail("");
      setAdminType("");
    }
  };

  // Initial check on mount
  useEffect(() => {
    updateAuthState();
  }, []);

  // Listen for same-tab and other-tab login/logout
  useEffect(() => {
    const handleStorage = () => updateAuthState();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChange", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChange", handleStorage);
    };
  }, []);

  // Normal user logout
  const logout = () => {
    sessionStorage.removeItem("hackathonUser");
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setLeaderName("");
    setUserRole("");
    
    // Trigger auth change event
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  // Admin logout
  const adminLogout = async () => {
    try {
      // Call backend logout API to clear cookies
      await fetch("http://localhost:3000/admin/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionStorage.getItem('authToken') || sessionStorage.getItem('adminAuthToken')}`
        }
      });
    } catch (error) {
      console.error("Logout API call failed, but clearing local session anyway");
    }

    // Clear all admin session data
    sessionStorage.removeItem("adminUser");
    sessionStorage.removeItem("adminAuthToken");
    sessionStorage.removeItem("authToken");
    sessionStorage.clear();

    // Update state
    setIsAdminAuthenticated(false);
    setAdminEmail("");
    setAdminType("");

    // Trigger auth change event
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <AuthContext.Provider 
      value={{ 
        // Normal user auth
        isAuthenticated, 
        leaderName, 
        userRole,
        logout,
        // Admin auth
        isAdminAuthenticated,
        adminEmail,
        adminType,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
