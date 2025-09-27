import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [leaderName, setLeaderName] = useState("");

	// Check login state on mount
	useEffect(() => {
		const userData = JSON.parse(sessionStorage.getItem("hackathonUser"));
		if (userData && userData.user && userData.token) {
			setIsAuthenticated(true);
			setLeaderName(userData.user.fullName || userData.user.name || "");
		} else {
			setIsAuthenticated(false);
			setLeaderName("");
		}
	}, []);

		// Listen for login/logout changes in sessionStorage and custom authChange event
		useEffect(() => {
			const handleStorage = () => {
				const userData = JSON.parse(sessionStorage.getItem("hackathonUser"));
				if (userData && userData.user && userData.token) {
					setIsAuthenticated(true);
					setLeaderName(userData.user.fullName || userData.user.name || "");
				} else {
					setIsAuthenticated(false);
					setLeaderName("");
				}
			};
			window.addEventListener("storage", handleStorage);
			window.addEventListener("authChange", handleStorage);
			return () => {
				window.removeEventListener("storage", handleStorage);
				window.removeEventListener("authChange", handleStorage);
			};
		}, []);

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
