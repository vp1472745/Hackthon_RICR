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

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const width = open ? "16rem" : "4rem";
    document.documentElement.style.setProperty("--sidebar-width", width);
  }, [open]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminUser");
    sessionStorage.removeItem("authToken");
    sessionStorage.clear(); // Clear all session storage
    onTabChange("logout");
    navigate("/dashboard/login", { replace: true });
  };

  const toggle = () => setOpen((v) => !v);

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 to-blue-700 text-white shadow-xl flex flex-col z-40 transition-all duration-300
          ${open ? "w-64" : "w-16"}
        `}
      >
        {/* Header */}
        <div
          className={`flex items-center gap-3 px-4 py-4 border-b mt-15 border-blue-800 w-full relative ${
            open ? "" : "justify-center"
          }`}
        >
          {open && <span className="text-xl font-bold tracking-wide">Super Admin</span>}

          {/* Toggle button (works on both desktop & mobile) */}
          <button
            className="ml-auto text-white p-1 rounded-lg hover:bg-blue-800 transition cursor-pointer"
            onClick={toggle}
            aria-label={isMobile ? (open ? "Close sidebar" : "Open sidebar") : (open ? "Collapse sidebar" : "Expand sidebar")}
          >
            {open ? (isMobile ? <FiX size={20} /> : <FiChevronLeft size={20} />) : <FiChevronRight size={20} />}
          </button>
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
                    }}
                    title={item.label}
                    className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg transition font-medium text-base
                      ${isActive ? "bg-white text-blue-800 shadow" : "hover:bg-blue-800 hover:text-white"}
                      ${open ? "" : "justify-center px-2"}
                    `}
                  >
                    {item.icon}
                    {open && <span className="truncate">{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className={`mt-auto w-full flex flex-col gap-3 ${open ? "px-4 pb-6" : "px-2 pb-6"}`}>
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className={`flex items-center ${open ? "justify-start" : "justify-center"} gap-3 w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition shadow min-w-0`}
          >
            {/* Icon always visible */}
            <div className="flex items-center justify-center" style={{ width: 24 }}>
              <FiLogOut size={20} />
            </div>

            {/* Text hidden when collapsed */}
            {open && <span className="ml-2">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
