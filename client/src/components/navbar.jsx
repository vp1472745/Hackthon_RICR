import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../configs/authContext"; // adjust path if needed

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { 
    isAuthenticated, 
    leaderName, 
    logout,
    isAdminAuthenticated,
    adminEmail,
    adminType,
    adminLogout 
  } = useAuth();
  const navigate = useNavigate();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 w-md sm:w-full ${
        isScrolled ? "shadow-lg py-2" : "shadow-md py-3"
      }`}
    >
      <div className="w-full px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 flex justify-between items-center">
        {/* Logo - Fully responsive */}
        <Link to="/" className="flex-shrink-0">
          <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-wide">
            <span className="text-[#0C2340]">Future</span>
            <span className="text-[#2A6EBB]">Maze</span>
            <span className="text-[#0C2340]"> by RICR</span>
          </h1>
        </Link>

        {/* Navbar links / actions - Responsive spacing */}
        <div className="flex justify-center items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
          {/* Normal User Authentication - Responsive text */}
          {isAuthenticated && leaderName && (
            <button
              onClick={() => navigate("/leader-dashboard")}
              className="text-[#2A6EBB] cursor-pointer font-medium sm:font-semibold text-xs sm:text-sm md:text-base mr-1 sm:mr-2 hidden xs:inline hover:underline transition-colors truncate max-w-32 sm:max-w-40 md:max-w-none"
              title={`Welcome, ${leaderName}`}
            >
              <span className="hidden md:inline">Welcome, </span>{leaderName}
            </button>
          )}

          {/* Admin Authentication - Responsive text */}
          {isAdminAuthenticated && adminEmail && (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => {
                  if (adminType === 'superadmin') {
                    navigate("/superadmin-dashboard");
                  } else {
                    navigate("/admin-dashboard");
                  }
                }}
                className="text-[#2A6EBB] cursor-pointer font-medium sm:font-semibold text-xs sm:text-sm md:text-base mr-1 sm:mr-2 hidden xs:inline hover:underline transition-colors truncate max-w-32 sm:max-w-40 md:max-w-none"
                title={`${adminType === 'superadmin' ? 'Super Admin' : 'Admin'}: ${adminEmail}`}
              >
                <span className="hidden md:inline">{adminType === 'superadmin' ? 'Super Admin' : 'Admin'}: </span>
                <span className="md:hidden">{adminType === 'superadmin' ? 'S.Admin' : 'Admin'}</span>
                <span className="hidden md:inline">{adminEmail}</span>
              </button>
            </div>
          )}

          {/* Show logout if either user or admin is authenticated - Responsive buttons */}
          {(isAuthenticated || isAdminAuthenticated) ? (
            <button
              onClick={isAdminAuthenticated ? adminLogout : logout}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-medium transition-colors duration-200 flex-shrink-0"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#2A6EBB] hover:bg-[#1D5B9B] cursor-pointer text-white rounded-md px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base font-medium transition-colors duration-200 flex-shrink-0"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;