import React, { useState } from 'react';
import { AdminAPI } from '../../../../configs/api';

const EditTheme = ({ theme, onClose, onThemeUpdated }) => {
  const [form, setForm] = useState({
    themeName: theme?.themeName || '',
    themeShortDescription: theme?.themeShortDescription || '',
    themeDescription: theme?.themeDescription || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AdminAPI.editTheme(theme._id, form);
      onThemeUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update theme');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block font-semibold mb-1">Theme Name</label>
        <input
          type="text"
          name="themeName"
          value={form.themeName}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Short Description</label>
        <textarea
          name="themeShortDescription"
          value={form.themeShortDescription}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          rows={2}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Full Description</label>
        <textarea
          name="themeDescription"
          value={form.themeDescription}
          onChange={handleChange}
          className="w-full border rounded-lg px-4 py-2"
          rows={4}
          required
        />
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-4 justify-end ">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded cursor-pointer bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="submit" disabled={loading} className="px-6 py-2 rounded cursor-pointer bg-blue-600 text-white font-semibold hover:bg-blue-700">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default EditTheme;
