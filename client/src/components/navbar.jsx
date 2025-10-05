import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "../configs/authContext"; // adjust path if needed

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
    adminLogout 
  } = useAuth();
  const navigate = useNavigate();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking outside or on links
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleNavigation = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  // Get appropriate dashboard route based on user role
  const getDashboardRoute = () => {
    if (userRole === 'Leader') {
      return '/leader-dashboard';
    } else if (userRole === 'Member') {
      return '/member-dashboard';
    }
    return '/leader-dashboard'; // Default fallback
  };

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300  ${
        isScrolled ? "shadow-lg py-2" : "shadow-md py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu}>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-wide">
            <span className="text-[#0C2340]">Future</span>
            <span className="text-[#2A6EBB]">Maze</span>
            <span className="text-[#0C2340] hidden xs:inline"> by RICR</span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex justify-center items-center gap-3">

          {/* Normal User Authentication */}
          {isAuthenticated && leaderName && (
            <button
              onClick={() => navigate(getDashboardRoute())}
              className="text-[#2A6EBB] cursor-pointer font-semibold mr-2 hover:underline transition-colors"
            >
              Welcome, {leaderName}
            </button>
          )}

          {/* Admin Authentication */}
          {isAdminAuthenticated && adminEmail && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (adminType === 'superadmin') {
                    navigate("/superadmin-dashboard");
                  } else {
                    navigate("/admin-dashboard");
                  }
                }}
                className="text-[#2A6EBB] cursor-pointer font-semibold mr-2 hover:underline transition-colors"
              >
                {adminType === 'superadmin' ? 'Super Admin' : 'Admin'}: {adminEmail}
              </button>
            </div>
          )}

          {/* Show logout if either user or admin is authenticated */}
          {(isAuthenticated || isAdminAuthenticated) ? (
            <button
              onClick={isAdminAuthenticated ? adminLogout : logout}
              className="bg-red-500 hover:bg-red-600 text-white cursor-pointer rounded-md px-4 py-1 transition-colors duration-200"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#2A6EBB] hover:bg-[#1D5B9B] cursor-pointer text-white rounded-md px-4 py-1 transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-700" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Mobile Menu Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="p-4 space-y-4">
          {/* User/Admin Info */}
          {isAuthenticated && leaderName && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                {userRole === 'Leader' ? 'Team Leader' : userRole === 'Member' ? 'Team Member' : 'Welcome back!'}
              </p>
              <button
                onClick={() => handleNavigation(getDashboardRoute())}
                className="text-[#2A6EBB] font-semibold hover:underline transition-colors"
              >
                {leaderName}
              </button>
            </div>
          )}

          {isAdminAuthenticated && adminEmail && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                {adminType === 'superadmin' ? 'Super Admin' : 'Admin'}
              </p>
              <button
                onClick={() => handleNavigation(adminType === 'superadmin' ? "/superadmin-dashboard" : "/admin-dashboard")}
                className="text-[#2A6EBB] font-semibold hover:underline transition-colors break-all"
              >
                {adminEmail}
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-2">
            <Link
              to="/"
              onClick={closeMobileMenu}
              className="block p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
            >
              Home
            </Link>
            
            {isAuthenticated && (
              <button
                onClick={() => handleNavigation(getDashboardRoute())}
                className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                <span className="flex items-center gap-2">
                  Dashboard
                  {userRole && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {userRole}
                    </span>
                  )}
                </span>
              </button>
            )}

            {isAdminAuthenticated && (
              <button
                onClick={() => handleNavigation(adminType === 'superadmin' ? "/superadmin-dashboard" : "/admin-dashboard")}
                className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Admin Dashboard
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            {(isAuthenticated || isAdminAuthenticated) ? (
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    adminLogout();
                  } else {
                    logout();
                  }
                  closeMobileMenu();
                }}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block w-full bg-[#2A6EBB] hover:bg-[#1D5B9B] text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 text-center"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;