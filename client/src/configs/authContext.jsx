import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [leaderName, setLeaderName] = useState("");

  // Safely parse JSON from sessionStorage
  const getUserData = () => {
    try {
      return JSON.parse(sessionStorage.getItem("hackathonUser"));
    } catch {
      return null;
    }
  };

  // Update auth state
  const updateAuthState = () => {
    const userData = getUserData();
    if (userData?.user && sessionStorage.getItem("authToken")) {
      setIsAuthenticated(true);
      setLeaderName(userData.user.fullName || userData.user.name || "");
    } else {
      setIsAuthenticated(false);
      setLeaderName("");
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

  // Logout
  const logout = () => {
    sessionStorage.removeItem("hackathonUser");
    sessionStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setLeaderName("");
    navigate("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, leaderName, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
