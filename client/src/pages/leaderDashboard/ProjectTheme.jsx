import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, Loader } from 'lucide-react';
import { projectThemeAPI, userAPI } from '../../configs/api';

const ProjectTheme = () => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  const teamId = getCookie('teamId');

  useEffect(() => {
    if (!teamId) {
      alert('Team ID not found! Please log in again.');
    }
  }, [teamId]);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const res = await projectThemeAPI.getAllThemes();
        setThemes(res.data.themes || []);
        console.log('Themes fetched:', res.data.themes);
      } catch (err) {
        console.error('Error fetching themes:', err);
        setError('Failed to load themes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  useEffect(() => {
    const fetchTeamThemeByUserId = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem('hackathonUser'))?.user?._id;
        if (!userId) {
          console.error('User ID not found in sessionStorage.');
          setError('User ID not found. Please log in again.');
          return;
        }

        console.log('Fetching team theme for userId:', userId);
        const response = await userAPI.getUserById(userId);
        const teamTheme = response.data.user.teamInfo?.team?.teamTheme;

        if (teamTheme) {
          setSelectedTheme(teamTheme.themeName);
          console.log('Fetched theme:', teamTheme.themeName);
        } else {
          setSelectedTheme(null);
          console.warn('No theme found for the user.');
        }

        // Log userId and response for debugging
        console.log('User ID from sessionStorage:', userId);
        console.log('Response from getUserById:', response.data);
        console.log('Team theme fetched:', teamTheme);
      } catch (err) {
        console.error('Error fetching team theme by user ID:', err);
        setError('Failed to fetch team theme. Please try again later.');
      }
    };

    fetchTeamThemeByUserId();
  }, []);

  const handleThemeSelect = (themeName) => {
    if (selectedTheme === themeName) return;
    setPendingSelection(themeName);
    setShowConfirmation(true);
  };

  const confirmSelection = async () => {
    if (!teamId || !pendingSelection) return;
    setLoading(true);
    try {
      await projectThemeAPI.selectThemeForTeam(teamId, pendingSelection);
      setSelectedTheme(pendingSelection);
      setShowConfirmation(false);
      setPendingSelection(null);
    } catch (err) {
      console.error(err);
      alert('Failed to select theme');
    }
    setLoading(false);
  };

  const cancelSelection = () => {
    setShowConfirmation(false);
    setPendingSelection(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-6">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className=" p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Themes</h1>
                  <p className="text-gray-600 text-lg">
                    Choose a theme for your hackathon project. You can change your selection until November 6, 2025.
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && themes.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <div className="text-gray-600">Loading themes...</div>
            </div>
          </div>
        )}

        {/* Theme Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 ml-10">
          {themes.map(theme => {
            const isSelected = selectedTheme === theme.themeName;
            return (
              <div
                key={theme._id}
                className={`group relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${isSelected
                    ? 'border-green-500 shadow-lg ring-4 ring-green-100 transform scale-105'
                    : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                  }`}
                onClick={() => handleThemeSelect(theme.themeName)}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>
                )}

                <div className="p-6 h-75">
                  {/* Theme Name */}
                  <h3 className="font-bold text-gray-900 text-xl leading-tight h-[30%]">
                    {theme.themeName.length > 50 ? `${theme.themeName.slice(0, 50)}...` : theme.themeName}
                  </h3>

                  {/* Theme Description */}
                  <p className="text-gray-600 leading-relaxed line-clamp-3 h-[50%]">
                    {theme.themeDescription.length > 100 ? `${theme.themeDescription.slice(0, 100)}...` : theme.themeDescription}
                  </p>

                  {/* Select Button */}
                  <button
                    className={`w-full py-3 h-[20%] px-4 rounded-xl font-semibold transition-all duration-200 ${isSelected
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md'
                      }`}
                    disabled={isSelected}
                  >
                    {isSelected ? 'Theme Selected' : 'Select Theme'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && themes.length === 0 && !error && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Themes Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Themes will be available soon. Please check back later.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all duration-300 scale-100">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Confirm Theme Selection</h3>
              </div>

              {/* Theme Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{pendingSelection}</div>
                    <div className="text-sm text-gray-600">Ready to build amazing things!</div>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="text-sm text-yellow-800">
                  You can change your theme until <strong>November 6, 2025</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={confirmSelection}
                  disabled={loading}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Selecting...
                    </div>
                  ) : (
                    'Confirm Selection'
                  )}
                </button>
                <button
                  onClick={cancelSelection}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTheme;