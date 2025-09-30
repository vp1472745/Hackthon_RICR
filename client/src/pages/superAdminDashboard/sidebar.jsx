// src/components/Sidebar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ onTabChange, activeTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
sessionStorage.removeItem('adminUser');
    // Notify parent about logout
      
    if (typeof onTabChange === 'function') onTabChange('logout');

    // navigate to admin login (use replace so history doesn't keep the protected page)
    navigate('/dashboard/login', { replace: true });
  };

  return (
    <aside className='w-64 bg-gray-100 p-4'>
      <nav>
        <ul className='space-y-2'>
          <li>
            <button
              type="button"
              className={`w-full text-left p-2 ${activeTab === 'home' ? 'bg-gray-300' : 'bg-transparent'}`}
              onClick={() => onTabChange('home')}
            >
              Home
            </button>
          </li>
          <li>
            <button
              type="button"
              className={`w-full text-left p-2 ${activeTab === 'settings' ? 'bg-gray-300' : 'bg-transparent'}`}
              onClick={() => onTabChange('settings')}
            >
              Settings
            </button>
          </li>

          <li>
            <button
              type="button"
              className={`w-full text-left p-2`}
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar
