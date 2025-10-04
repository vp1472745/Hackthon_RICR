import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, Loader, Calendar, Info } from 'lucide-react';
import { projectThemeAPI, userAPI, authAPI } from '../../configs/api';

const ProjectTheme = () => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', text: '' });

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
        // Use projectThemeAPI to get only active themes for users
        const res = await projectThemeAPI.getAllThemes();
        console.log('🎯 Active themes fetched:', res.data.themes);
        setThemes(res.data.themes || []);
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

        const response = await userAPI.getUserById(userId);
        const teamTheme = response.data.user.teamInfo?.team?.teamTheme;

        if (teamTheme) {
          setSelectedTheme(teamTheme.themeName);
        } else {
          setSelectedTheme(null);
        }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-3 sm:p-4 md:p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">

              
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-row sm:flex-row items-center gap-3 sm:gap-4 mb-4 ">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
            </div>
            <div className="  ">
              <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 mb-2">Project Themes</h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-1xl">
                Choose a theme that inspires your hackathon project. Your selection guides your innovation journey.
              </p>
            </div>
          </div>
        </div>

        {/* Deadline Banner */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3 sm:px-4 py-2 sm:py-3 shadow-sm border border-gray-200">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Theme selection deadline: <strong className="text-blue-600">November 6, 2025</strong>
            </span>
          </div>
        </div>

        {/* Loading State */}
        {loading && themes.length === 0 && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <div className="text-center">
              <Loader className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600 animate-spin mx-auto mb-3 sm:mb-4" />
              <div className="text-gray-600 font-medium text-sm sm:text-base">Loading themes...</div>
              <div className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">Preparing your innovation journey</div>
            </div>
          </div>
        )}

        {/* Theme Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-10 md:mb-12">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.themeName;
            return (
              <div
                key={theme._id}
                className={`group relative bg-white rounded-xl sm:rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-md ${
                  isSelected
                    ? 'border-green-500 shadow-lg ring-2 ring-green-100'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-10">
                    <div className="bg-green-500 text-white p-1 sm:p-2 rounded-full shadow-lg border-2 sm:border-4 border-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs font-semibold hidden xs:inline">SELECTED</span>
                    </div>
                  </div>
                )}

                <div className="p-4 sm:p-5 md:p-6">
                  {/* Theme Header */}
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl leading-tight mb-1 sm:mb-2 break-words">
                        {theme.themeName}
                      </h3>
                    </div>
                  </div>

                  {/* Theme Content */}
                  <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-5 md:mb-6">
                    {/* Theme Short Description */}
                    <div className="mb-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-black mb-1">Theme Short Description</span>
                        <p className="text-gray-500 text-xs sm:text-sm break-words" title={theme.themeShortDescription}>
                          {theme.themeShortDescription && theme.themeShortDescription.length > 30
                            ? theme.themeShortDescription.slice(0, 30) + '...'
                            : theme.themeShortDescription}
                        </p>
                      </div>
                      {theme.themeShortDescription && theme.themeShortDescription.length > 30 && (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline text-xs font-semibold self-start sm:self-center mt-1 sm:mt-0"
                          onClick={e => { e.stopPropagation(); setModalContent({ title: 'Theme Short Description', text: theme.themeShortDescription }); setModalOpen(true); }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                    {/* Theme Description */}
                    <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-black mb-1">Theme Description</span>
                        <p className="text-gray-600 text-xs sm:text-sm break-words" title={theme.themeDescription}>
                          {theme.themeDescription && theme.themeDescription.length > 30
                            ? theme.themeDescription.slice(0, 30) + '...'
                            : theme.themeDescription}
                        </p>
                      </div>
                      {theme.themeDescription && theme.themeDescription.length > 30 && (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline text-xs font-semibold self-start sm:self-center mt-1 sm:mt-0"
                          onClick={e => { e.stopPropagation(); setModalContent({ title: 'Theme Description', text: theme.themeDescription }); setModalOpen(true); }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleThemeSelect(theme.themeName)}
                    disabled={isSelected}
                    className={`w-full py-2 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {isSelected ? (
                      <div className="flex items-center justify-center gap-1 sm:gap-2">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        Theme Selected
                      </div>
                    ) : (
                      'Select This Theme'
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && themes.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-700 mb-2 sm:mb-3">No Themes Available</h3>
            <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base md:text-lg px-4">
              We're curating exciting themes for your hackathon. Please check back soon.
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-confirmation-title"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-auto">
            <div className="p-4 sm:p-6 md:p-8">
              {/* Modal Header */}
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                </div>
                <h3 id="theme-confirmation-title" className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Confirm Theme Selection
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">You're about to select the following theme:</p>
              </div>

              {/* Theme Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-blue-200">
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-1 sm:mb-2 break-words">{pendingSelection}</div>
                  <div className="text-blue-600 font-medium text-sm sm:text-base">Ready to build amazing things!</div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-yellow-800 font-medium break-words">
                      You can change your theme until November 6, 2025
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={confirmSelection}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50 font-semibold text-xs sm:text-sm"
                >
                  {loading ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      <span className="hidden xs:inline">Selecting Theme...</span>
                      <span className="xs:hidden">Selecting...</span>
                    </div>
                  ) : (
                    'Confirm Selection'
                  )}
                </button>

                <button
                  onClick={cancelSelection}
                  disabled={loading}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-semibold text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Read More Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-sm sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 md:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">{modalContent.title}</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100 flex-shrink-0 ml-2"
                  onClick={() => setModalOpen(false)}
                >
                  <span className="text-2xl font-light">&times;</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {modalContent.text}
                </p>
              </div>
            </div>
            <div className="p-4 sm:p-5 md:p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-2 sm:py-3 px-4 bg-blue-600 text-white rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTheme;