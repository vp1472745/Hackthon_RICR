import React, { useState } from 'react';
import { subAdminAPI } from '../../../configs/api';

const AddTheme = ({ onThemeCreated }) => {
  const [themeName, setThemeName] = useState('');
  const [themeShortDescription, setThemeShortDescription] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const themeData = { themeName, themeShortDescription, themeDescription };
      const res = await subAdminAPI.createTheme(themeData);
      setSuccess('Theme created successfully!');
      setThemeName('');
      setThemeShortDescription('');
      setThemeDescription('');
      if (onThemeCreated) onThemeCreated(res.data.theme);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create theme');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
 

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Theme Information</h2>
              <p className="text-blue-100 text-sm">Fill in the details below to create a new theme</p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Theme Name Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span>Theme Name</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={themeName}
                  onChange={e => setThemeName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                  placeholder="Enter a unique theme name"
                  required
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Short Description Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span>Short Description</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={themeShortDescription}
                  onChange={e => setThemeShortDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50"
                  placeholder="Brief description of the theme"
                  required
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500">This will be displayed in theme lists and previews</p>
            </div>

            {/* Full Description Field */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <span>Full Description</span>
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <textarea
                  value={themeDescription}
                  onChange={e => setThemeDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 resize-none"
                  rows={5}
                  placeholder="Detailed description of the theme features and design elements..."
                  required
                />
                <div className="absolute right-3 top-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-gray-500">Describe the theme in detail including color schemes, typography, and design principles</p>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="flex items-center space-x-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 text-sm font-medium">{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center space-x-2 p-4 bg-green-50 border border-green-200 rounded-xl">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-700 text-sm font-medium">{success}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Theme...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Save Theme</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

  
    </div>
  );
};

export default AddTheme;