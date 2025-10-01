import React, { useState } from 'react';
import { AdminAPI } from '../../../../configs/api';


const DeleteTheme = ({ theme, onClose, onThemeDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


    const handleDelete = async () => {
    if (!theme || !theme._id) {
      setError('Theme ID is missing. Cannot delete.');
      console.error('DeleteTheme: theme object is', theme);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await AdminAPI.deleteTheme(theme._id);
      onThemeDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete theme');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg text-gray-800 font-semibold">
        {theme && theme.themeName ? (
          <>
            Are you sure you want to delete the theme <span className="text-red-600">{theme.themeName}</span>?
          </>
        ) : (
          <span className="text-red-600">Theme data is missing or invalid.</span>
        )}
        {/* Debug info for developers */}
        <pre className="text-xs text-gray-400 bg-gray-50 p-2 rounded mt-2">{JSON.stringify(theme, null, 2)}</pre>
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="button" onClick={handleDelete} disabled={loading || !theme || !theme._id} className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};

export default DeleteTheme;
