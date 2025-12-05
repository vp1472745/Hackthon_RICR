import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../configs/authContext"; // adjust path if needed
import LOGO from "../../public/navlogo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    isAuthenticated,
    leaderName,
    userRole,
    logout,
    isAdminAuthenticated,
    adminEmail,
    adminType,
    adminLogout,
  } = useAuth();
  const navigate = useNavigate();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on links
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  // Get appropriate dashboard route based on user role
  const getDashboardRoute = () => {
    if (userRole === "Leader") {
      return "/leader-dashboard";
    } else if (userRole === "Member") {
      return "/member-dashboard";
    }
    return "/leader-dashboard"; // Default fallback
  };

  return (
    <>
      <nav
        className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "shadow-lg py-1" : "shadow-md py-1"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" onClick={closeMobileMenu} className="flex items-center shrink-0">
            <div className="">
              <img
                src={LOGO}
                className="w-8 sm:w-10 md:w-12 lg:w-14 h-auto"
                alt="Nav Kalpana Logo"
              />
            </div>
            <div className="ml-2 sm:ml-3 flex items-center">
              <h1 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-wide whitespace-nowrap">
                <span className="text-[#0C2340]">Nav</span>
                <span className="text-[#2A6EBB]">Kalpana</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {/* Normal User Authentication */}
            {isAuthenticated && leaderName && (
              <button
                onClick={() => navigate(getDashboardRoute())}
                className="text-[#2A6EBB] cursor-pointer font-semibold text-sm lg:text-base hover:underline transition-colors whitespace-nowrap px-2"
              >
                Welcome, {leaderName}
              </button>
            )}

            {/* Admin Authentication */}
            {isAdminAuthenticated && adminEmail && (
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (adminType === "superadmin") {
                      navigate("/superadmin-dashboard");
                    } else {
                      navigate("/admin-dashboard");
                    }
                  }}
                  className="text-[#2A6EBB] cursor-pointer font-semibold text-sm lg:text-base hover:underline transition-colors whitespace-nowrap px-2"
                >
                  {adminType === "superadmin" ? "Super Admin" : "Admin"}:{" "}
                  <span className="text-gray-700 font-normal">
                    {adminEmail.split('@')[0]}
                  </span>
                </button>
              </div>
            )}

            {/* Show logout if either user or admin is authenticated */}
            {isAuthenticated || isAdminAuthenticated ? (
              <button
                onClick={isAdminAuthenticated ? adminLogout : logout}
                className="bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-md px-4 py-2 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap"
              >
                Logout
              </button>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link
                  to="/login"
                  className="bg-[#2A6EBB] hover:bg-[#1D5B9B] cursor-pointer text-white rounded-lg px-4 lg:px-5 py-2 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#2A6EBB] hover:bg-[#1D5B9B] cursor-pointer text-white rounded-lg px-4 lg:px-5 py-2 transition-colors duration-200 text-sm lg:text-base whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-xs sm:max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <div className="flex items-center">
            <img
              src={LOGO}
              className="w-8 h-8 mr-3"
              alt="Nav Kalpana Logo"
            />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              NavKalpana
            </h2>
          </div>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto h-[calc(100%-73px)]">
          {/* User/Admin Info */}
          {isAuthenticated && leaderName && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {userRole === "Leader"
                  ? "Team Leader"
                  : userRole === "Member"
                  ? "Team Member"
                  : "Welcome back!"}
              </p>
              <button
                onClick={() => handleNavigation(getDashboardRoute())}
                className="text-[#2A6EBB] font-semibold text-sm sm:text-base hover:underline transition-colors text-left w-full"
              >
                {leaderName}
              </button>
            </div>
          )}

          {isAdminAuthenticated && adminEmail && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {adminType === "superadmin" ? "Super Admin" : "Admin"}
              </p>
              <button
                onClick={() =>
                  handleNavigation(
                    adminType === "superadmin"
                      ? "/superadmin-dashboard"
                      : "/admin-dashboard"
                  )
                }
                className="text-[#2A6EBB] font-semibold text-sm sm:text-base hover:underline transition-colors text-left w-full break-words"
              >
                {adminEmail}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm sm:text-base"
            >
              Home
            </Link>

            {isAuthenticated && leaderName && (
              <button
                onClick={() => handleNavigation(getDashboardRoute())}
                className="block w-full text-left p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm sm:text-base"
              >
                Dashboard
              </button>
            )}

            {isAdminAuthenticated && (
              <button
                onClick={() =>
                  handleNavigation(
                    adminType === "superadmin"
                      ? "/superadmin-dashboard"
                      : "/admin-dashboard"
                  )
                }
                className="block w-full text-left p-3 sm:p-4 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium text-sm sm:text-base"
              >
                Admin Dashboard
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 sm:pt-5 border-t border-gray-200 space-y-3">
            {isAuthenticated || isAdminAuthenticated ? (
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    adminLogout();
                  } else {
                    logout();
                  }
                  closeMobileMenu();
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base"
              >
                Logout
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex-1 bg-[#2A6EBB] hover:bg-[#1D5B9B] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex-1 bg-[#2A6EBB] hover:bg-[#1D5B9B] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;