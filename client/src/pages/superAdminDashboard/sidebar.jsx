import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUsers,
  FiLayers,
  FiAward,
  FiFileText,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiX
} from "react-icons/fi";

const NAV_ITEMS = [
  { key: "Home", label: "Overview", icon: <FiHome size={20} /> },
  { key: "Team", label: "Team Manage", icon: <FiUsers size={20} /> },
  { key: "Theme", label: "Theme Manage", icon: <FiLayers size={20} /> },
  { key: "Result", label: "Result Manage", icon: <FiAward size={20} /> },
  { key: "Ps", label: "PS Manage", icon: <FiFileText size={20} /> },
];

const Sidebar = ({ onTabChange = () => {}, activeTab = "Home" }) => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setOpen(false);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update CSS variable for parent margin
  useEffect(() => {
    const width = open ? "16rem" : "4rem"; 
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, [open]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminUser");
    onTabChange("logout");
    navigate("/dashboard/login", { replace: true });
  };

  const toggle = () => setOpen((v) => !v);

  // Close sidebar when clicking on mobile overlay
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && open && !event.target.closest('aside')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, open]);

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile menu button when sidebar is closed */}
      {!open && isMobile && (
        <button
          className="fixed top-4 left-4 z-50 bg-blue-900 text-white p-2 rounded-lg shadow-lg md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <FiMenu size={20} />
        </button>
      )}


      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white shadow-xl flex flex-col z-40 transition-all duration-300
          ${open ? "w-64" : "w-16"}
          ${isMobile && open ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"}
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-4 py-4 border-b mt-15 border-blue-800 w-full relative ${
            open ? "" : "justify-center"
          }`}
        >
          {open && <span className="text-xl font-bold tracking-wide">Super Admin</span>}
          
          {/* Toggle button for both desktop and mobile - positioned at top right next to Super Admin */}
          {open && (
            <button
              className="ml-auto text-white p-1 rounded-lg hover:bg-blue-800 transition cursor-pointer"
              onClick={toggle}
              aria-label={isMobile ? "Close sidebar" : "Collapse sidebar"}
            >
              {isMobile ? <FiX size={20} /> : <FiChevronLeft size={20} />}
            </button>
          )}


                    {/* Collapse/Expand Button - Desktop only when collapsed */}
          {!isMobile && !open && (
            <button
              onClick={toggle}
              aria-label="Expand sidebar"
              className="flex items-center justify-center w-full py-2 cursor-pointer rounded-lg bg-blue-800 hover:bg-blue-900 transition"
            >
              <FiChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 py-6 ${open ? "px-2" : "px-1"}`}>
          <ul className="space-y-2">
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => {
                      onTabChange(item.key);
                      if (isMobile) setOpen(false);
                    }}
                    title={item.label}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium text-base
                      ${isActive ? "bg-white text-blue-800 shadow" : "hover:bg-blue-800 hover:text-white"}
                      ${open ? "" : "justify-center px-2"}
                    `}
                  >
                    {item.icon}
                    {open && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom controls: Toggle (desktop only when collapsed) + Logout */}
        <div className="mt-auto w-full flex flex-col gap-3 px-4 pb-6">


          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition shadow
              ${open ? "" : "justify-center px-2"}
            `}
          >
            <FiLogOut size={20} />
            {open && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;