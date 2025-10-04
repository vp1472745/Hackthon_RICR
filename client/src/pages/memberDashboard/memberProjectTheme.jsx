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
    // Member dashboard - selection disabled
    // Only team leaders can select themes
    return;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 sm:p-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className=" ">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Themes</h1>
              <p className="text-gray-600 text-lg">View available hackathon themes selected by your team leader. Explore theme details and understand your project direction.</p>
              <div className="flex items-center gap-2 mt-2">
                <Info className="w-4 h-4 text-amber-600" />
                <p className="text-sm text-amber-700 font-medium">Member View - Theme selection is managed by team leader</p>
              </div>
            </div>
          </div>
        </div>

<div className='text-center mb-10'>
          <div className="inline-flex items-center gap-2 mb-10 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700 text-center justify-center">
            Theme selection deadline: <strong className="text-blue-600">November 6, 2025</strong>
          </span>
        </div>
</div>

        {/* Loading State */}
        {loading && themes.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <div className="text-gray-600 font-medium">Loading themes...</div>
              <div className="text-gray-500 text-sm mt-2">Preparing your innovation journey</div>
            </div>
          </div>
        )}

        {/* Theme Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.themeName;
            return (
              <div
                key={theme._id}
                className={`group relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-300 hover:shadow-md ${isSelected
                  ? 'border-green-500 shadow-lg ring-2 ring-green-100'
                  : 'border-gray-200 hover:border-blue-300'
                  }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-10">
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">SELECTED</span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Theme Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-xl leading-tight mb-2">
                        {theme.themeName}
                      </h3>
                    </div>
                  </div>

                  {/* Theme Content */}
                  <div className="space-y-4 mb-6">
                    {/* Theme Short Description */}
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-black mb-1">Theme Short Description</span>
                        <p className="text-gray-500 text-sm" title={theme.themeShortDescription}>
                          {theme.themeShortDescription && theme.themeShortDescription.length > 30
                            ? theme.themeShortDescription.slice(0, 30) + '...'
                            : theme.themeShortDescription}
                        </p>
                      </div>
                      {theme.themeShortDescription && theme.themeShortDescription.length > 30 && (
                        <button
                          type="button"
                          className="ml-2 text-blue-600 hover:underline text-xs font-semibold"
                          onClick={e => { e.stopPropagation(); setModalContent({ title: 'Theme Short Description', text: theme.themeShortDescription }); setModalOpen(true); }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                    {/* Theme Description */}
                    <div className="mb-4 flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-black mb-1">Theme Description</span>
                        <p className="text-gray-600 text-sm" title={theme.themeDescription}>
                          {theme.themeDescription && theme.themeDescription.length > 30
                            ? theme.themeDescription.slice(0, 30) + '...'
                            : theme.themeDescription}
                        </p>
                      </div>
                      {theme.themeDescription && theme.themeDescription.length > 30 && (
                        <button
                          type="button"
                          className="ml-2 text-blue-600 hover:underline text-xs font-semibold"
                          onClick={e => { e.stopPropagation(); setModalContent({ title: 'Theme Description', text: theme.themeDescription }); setModalOpen(true); }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Read-Only Status Display */}
                  <div className={`w-full py-3 px-4 rounded-xl font-semibold text-sm text-center ${isSelected
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                    {isSelected ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Selected by Team Leader
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Info className="w-4 h-4" />
                        Available Theme
                      </div>
                    )}
                  </div>
                  
                  {/* Member Note */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-500">
                      🔒 Only team leaders can select themes
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && themes.length === 0 && !error && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">No Themes Available</h3>
            <p className="text-gray-500 max-w-md mx-auto text-lg">
              We're curating exciting themes for your hackathon. Please check back soon.
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
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
            <div className="p-8">
              {/* Modal Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 id="theme-confirmation-title" className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Theme Selection
                </h3>
                <p className="text-gray-600">You're about to select the following theme:</p>
              </div>

              {/* Theme Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6 border border-blue-200">
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-xl mb-2">{pendingSelection}</div>
                  <div className="text-blue-600 font-medium">Ready to build amazing things!</div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">
                      You can change your theme until November 6, 2025
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirmSelection}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50 font-semibold text-sm"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      Selecting Theme...
                    </div>
                  ) : (
                    'Confirm Selection'
                  )}
                </button>

                <button
                  onClick={cancelSelection}
                  disabled={loading}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{modalContent.title}</h2>
                <button
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                  onClick={() => setModalOpen(false)}
                >
                  <span className="text-2xl font-light">&times;</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-blue max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {modalContent.text}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setModalOpen(false)}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold text-sm"
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