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
import { usePermissions } from "../hooks/usePermissions";

const NAV_ITEMS = [
  {
    key: "Home",
    label: "Overview",
    icon: <FiHome size={20} />,
    permission: "viewOverview"
  },
  {
    key: "Team",
    label: "Team Manage",
    icon: <FiUsers size={20} />,
    permission: "manageTeams"
  },
  {
    key: "Theme",
    label: "Theme Manage",
    icon: <FiLayers size={20} />,
    permission: "manageThemes"
  },
  {
    key: "Result",
    label: "Result Manage",
    icon: <FiAward size={20} />,
    permission: "manageResults"
  },
  {
    key: "Ps",
    label: "PS Manage",
    icon: <FiFileText size={20} />,
    permission: "manageProblemStatements"
  },
   {
    key: "Accomodation",
    label: "Accommodation Manage",
    icon: <FiFileText size={20} />,
    permission: "manageAccomodations"
  },
{
  key: "Payment",
  label: "Payment Manage",
  icon: <FiFileText size={20} />,
  permission: "viewPayments"
}
];

const Sidebar = ({ onTabChange = () => { }, activeTab = "Home" }) => {
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const { hasPermission, loading, error, refetchPermissions } = usePermissions();

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
          className={`flex items-center gap-3 px-4 py-4 border-b mt-15 border-blue-800 w-full relative ${open ? "" : "justify-center"
            }`}
        >
          {open && <span className="text-xl font-bold tracking-wide"> Admin</span>}

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
          {loading && (
            <div className={`text-center ${open ? "px-4" : "px-2"} py-4`}>
              <div className="text-white text-sm">Loading permissions...</div>
            </div>
          )}

          {error && (
            <div className={`text-center ${open ? "px-4" : "px-2"} py-4`}>
              <div className="text-red-300 text-sm">Error loading permissions</div>
            </div>
          )}

          <ul className="space-y-2">
            {NAV_ITEMS.filter((item) => hasPermission(item.permission)).map((item) => {
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
          {/* Refresh Permissions Button */}
          <div className={`mt-6 ${open ? "px-4" : "px-2"}`}>
            <button
              type="button"
              onClick={refetchPermissions}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-2 rounded-lg font-medium text-sm transition-colors"
            >
              Refresh Permissions
            </button>
          </div>
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;
