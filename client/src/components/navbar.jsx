import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../configs/authContext"; // adjust path if needed

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, leaderName, logout } = useAuth();
  const navigate = useNavigate();

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-lg py-2" : "shadow-md py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-xl md:text-2xl font-bold tracking-wide">
            <span className="text-[#0C2340]">Future</span>
            <span className="text-[#2A6EBB]">Maze</span>
            <span className="text-[#0C2340]"> by RICR</span>
          </h1>
        </Link>

        {/* Navbar links / actions */}
        <div className="flex justify-center items-center gap-3">
          {isAuthenticated && leaderName && (
            <button
              onClick={() => navigate("/leader-dashboard")}
              className="text-[#2A6EBB] cursor-pointer font-semibold mr-2 hidden sm:inline hover:underline transition-colors"
            >
              Welcome, {leaderName}
            </button>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
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
      </div>
    </nav>
  );
};

export default Navbar;
