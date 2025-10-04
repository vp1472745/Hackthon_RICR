import React, { useState, useEffect } from 'react';
import { subAdminAPI } from '../../../../configs/api';

const EditPS = ({ problem, onClose, onPSUpdated, themes: propThemes }) => {
  const [form, setForm] = useState({
    PStitle: problem?.PStitle || '',
    PSdescription: problem?.PSdescription || '',
    PSTheme: problem?.PSTheme?._id || problem?.PSTheme || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [themes, setThemes] = useState(propThemes || []);

  useEffect(() => {
    if (!propThemes || propThemes.length === 0) {
      // Fetch themes if not provided
      (async () => {
        try {
          const res = await subAdminAPI.getAllThemes();
          setThemes(res.data.themes || []);
        } catch (err) {
          setThemes([]);
        }
      })();
    }
  }, [propThemes]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await subAdminAPI.editProblemStatement(problem._id, form);
      onPSUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update problem statement');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-semibold mb-1">Title</label>
        <input
          type="text"
          name="PStitle"
          value={form.PStitle}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Description</label>
        <textarea
          name="PSdescription"
          value={form.PSdescription}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          rows={4}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Theme</label>
        <select
          name="PSTheme"
          value={form.PSTheme}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        >
          <option value="" disabled>Select Theme</option>
          {themes && themes.map((theme) => (
            <option key={theme._id} value={theme._id}>{theme.themeName}</option>
          ))}
        </select>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg cursor-pointer  bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2 rounded-lg cursor-pointer bg-blue-600 text-white font-semibold hover:bg-blue-700">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditPS;