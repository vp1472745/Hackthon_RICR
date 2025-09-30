import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, Loader } from 'lucide-react';
import { projectThemeAPI, userAPI ,authAPI} from '../../configs/api';

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
      const refresh_response = await authAPI.refreshData();
      sessionStorage.setItem('hackathonUser', JSON.stringify({
        email: refresh_response.data.user.email,
        user: refresh_response.data.user,
        team: refresh_response.data.team,
        theme: refresh_response.data.theme,
        ProblemStatements: refresh_response.data.ProblemStatements,
        loginTime: sessionStorage.getItem('hackathonUser') ? JSON.parse(sessionStorage.getItem('hackathonUser')).loginTime : new Date().toISOString(),
      }));

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
    <div className="overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="p-6 md:p-8 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-start md:items-center gap-4 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Project Themes</h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Choose a theme for your hackathon project. You can change your selection until <strong>November 6, 2025</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-red-700 font-medium">{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading && themes.length === 0 && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <div className="text-gray-600">Loading themes...</div>
            </div>
          </div>
        )}

        {/* Theme Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.themeName;
            return (
              <button
                key={theme._id}
                onClick={() => handleThemeSelect(theme.themeName)}
                aria-pressed={isSelected}
                className={`group relative text-left bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 ${isSelected
                    ? 'border-green-500 shadow-lg ring-4 ring-green-100 transform scale-102'
                    : 'border-gray-200 hover:border-blue-300 hover:scale-105'
                  }`}
              >
                {/* Selected Indicator */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col h-full min-h-[180px]">
                  {/* Theme Name */}
                  <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-2 line-clamp-2">
                    {theme.themeName}
                  </h3>

                  {/* Theme Description */}
                  <p className="text-gray-600 text-sm sm:text-sm leading-relaxed flex-1 line-clamp-4 mb-4">
                    {theme.themeDescription}
                  </p>

                  {/* Select Button (full-width on small screens) */}
                  <div className="mt-2">
                    <button
                      type="button"
                      disabled={isSelected}
                      className={`w-full py-2 px-4 rounded-xl font-semibold transition-all duration-200 ${isSelected
                          ? 'bg-green-100 text-green-700 cursor-default border border-green-200'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md'
                        }`}
                      aria-disabled={isSelected}
                    >
                      {isSelected ? 'Theme Selected' : 'Select Theme'}
                    </button>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && themes.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Themes Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Themes will be available soon. Please check back later.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-confirmation-title"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-auto overflow-auto">
            <div className="p-5 sm:p-6">
              {/* Modal Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-blue-600" />
                </div>
                <h3 id="theme-confirmation-title" className="text-lg sm:text-xl font-semibold text-gray-900">
                  Confirm Theme Selection
                </h3>
              </div>

              {/* Theme Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-base sm:text-lg">{pendingSelection}</div>
                    <div className="text-sm text-gray-600">Ready to build amazing things!</div>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                <div className="text-sm text-yellow-800">
                  You can change your theme until <strong>November 6, 2025</strong>
                </div>
              </div>

              {/* Action Buttons (stack on mobile) */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirmSelection}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50 font-semibold"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
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
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
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
