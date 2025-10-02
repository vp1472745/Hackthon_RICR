import React, { useState, useEffect } from 'react';
import { subAdminAPI } from '../../../configs/api';



const ALL_PERMISSIONS = [
  { key: 'createTheme', label: 'Create Theme' },
  { key: 'editTheme', label: 'Edit Theme' },
  { key: 'deleteTheme', label: 'Delete Theme' },
  { key: 'viewThemes', label: 'View Themes' },
  { key: 'createProblemStatement', label: 'Create Problem Statement' },
  { key: 'editProblemStatement', label: 'Edit Problem Statement' },
  { key: 'deleteProblemStatement', label: 'Delete Problem Statement' },
  { key: 'viewUsers', label: 'View Users' },
  { key: 'viewTeams', label: 'View Teams' },
  { key: 'viewProblemStatements', label: 'View Problem Statements' },
  // Add more as needed
];

const AdminAccess = () => {
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState('');

    useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await subAdminAPI.getAllAdmins();
        if (response.data && response.data.admins) {
          setAdmins(response.data.admins);
        } else if (Array.isArray(response.data)) {
          setAdmins(response.data);
        }
        } catch (err) {
        console.error('Error fetching admins:', err);
        }
    };
    fetchAdmins();
  }
, []);

  const filteredAdmins = admins.filter(admin => 
    admin.email.toLowerCase().includes(search.toLowerCase())
  );
    const handleCheckbox = (perm) => {
    if (selected.includes(perm)) {
        setSelected(selected.filter(p => p !== perm));
    } else {
        setSelected([...selected, perm]);
    }
    };
    const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
        await subAdminAPI.setAdminPermissions(email, selected);
        setMsg('Permissions updated successfully');
    }
    catch (err) {
        console.error('Error setting permissions:', err);
        setError(err.response?.data?.message || 'Failed to set permissions');
    }
    setLoading(false);
    };



  return (
    <div className="max-w-lg mx-auto bg-white shadow rounded p-8 mt-8">
      <h2 className="text-xl font-bold mb-4">Assign Admin Permissions</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-semibold mb-2">Admin Email</label>
          
          <select
            className="w-full border px-4 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          >
            <option value="">Select admin email</option>
            {filteredAdmins.map((admin) => (
              <option key={admin._id} value={admin.email}>
                {admin.email}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-2">Permissions</label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_PERMISSIONS.map((perm) => (
              <label key={perm.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selected.includes(perm.key)}
                  onChange={() => handleCheckbox(perm.key)}
                />
                {perm.label}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Permissions'}
        </button>
        {msg && <div className="text-green-600 mt-2">{msg}</div>}
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default AdminAccess;