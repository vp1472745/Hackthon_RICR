import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, Loader, Calendar, Info, AlertCircle } from 'lucide-react';
import { projectThemeAPI, userAPI, authAPI, homeAPI } from '../../configs/api';
import { toast } from 'react-hot-toast';

const ProjectTheme = () => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', text: '' });
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitedTheme, setLimitedTheme] = useState(null);

  // Real-time update states
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [isPolling, setIsPolling] = useState(false);
  const [isDeactivatedMode, setIsDeactivatedMode] = useState(false);
  const [themeCount, setThemeCount] = useState(0);
  const [lastChangeType, setLastChangeType] = useState('');

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

  // Initial theme fetch
  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        // Use homeAPI to get themes with team count
        const res = await homeAPI.getAllThemes();

        const themes = res.data.themes || [];
        setThemes(themes);
        setThemeCount(themes.length);
        setLastUpdateTime(Date.now());
      } catch (err) {
        setError('Failed to load themes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchThemes();
  }, []);

  // Real-time polling for theme updates
  useEffect(() => {
    if (!teamId) return;

    const pollForUpdates = async () => {
      try {
        setIsPolling(true);

        // Always poll for theme updates with team count
        const res = await homeAPI.getAllThemes();

        if (res.data) {
          const newThemes = res.data.themes || [];
          const currentTime = Date.now();

          // Check if themes list changed
          const themesChanged = JSON.stringify(newThemes) !== JSON.stringify(themes);

          if (themesChanged) {
            const oldCount = themeCount;
            const newCount = newThemes.length;

            console.log('🔄 Themes updated:', newCount, 'themes available');
            setThemes(newThemes);
            setThemeCount(newCount);
            setLastUpdateTime(currentTime);

            // Determine change type
            let changeType = '';
            if (newCount > oldCount) {
              changeType = 'added';
              setLastChangeType(`+${newCount - oldCount} theme${newCount - oldCount > 1 ? 's' : ''} added`);
            } else if (newCount < oldCount) {
              changeType = 'removed';
              setLastChangeType(`${oldCount - newCount} theme${oldCount - newCount > 1 ? 's' : ''} removed`);
            } else {
              changeType = 'updated';
              setLastChangeType('themes updated');
            }

            // Show appropriate notification
            const message = `${changeType === 'added' ? '✨' : changeType === 'removed' ? '🗑️' : '🔄'} Themes ${changeType} - ${newCount} available`;
            toast.info(message, {
              position: "bottom-right",
              autoClose: 3000,
              hideProgressBar: true,
            });

      
          }

          // Also check for team theme changes
          const userId = JSON.parse(sessionStorage.getItem('hackathonUser'))?.user?._id;
          if (userId) {
            try {
              const userResponse = await userAPI.getUserById(userId);
              const currentTeamTheme = userResponse.data.user.teamInfo?.team?.teamTheme?.themeName;

              if (currentTeamTheme !== selectedTheme) {
              
                setSelectedTheme(currentTeamTheme);
                setLastUpdateTime(currentTime);

                if (currentTeamTheme) {
                  toast.success(`Theme selection updated: ${currentTeamTheme}`, {
                    position: "top-center",
                    autoClose: 3000,
                  });
                }
              }
            } catch (userErr) {
              console.warn('Failed to check team theme:', userErr);
            }
          }

          // Always update last check time
          setLastUpdateTime(currentTime);
        }
      } catch (err) {
        // Silently handle polling errors to avoid spam
        console.warn('Theme polling error:', err);
      } finally {
        setIsPolling(false);
      }
    };

    // Initial poll after component mount
    const initialTimeout = setTimeout(pollForUpdates, 2000);

    // Poll every 8 seconds for more frequent updates
    const pollInterval = setInterval(pollForUpdates, 8000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(pollInterval);
    };
  }, [teamId, themes, selectedTheme]);

  useEffect(() => {
    const fetchTeamThemeByUserId = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem('hackathonUser'))?.user?._id;
        if (!userId) {

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

        setError('Failed to fetch team theme. Please try again later.');
      }
    };

    fetchTeamThemeByUserId();
  }, []);


  const handleThemeSelect = (themeName) => {
    if (selectedTheme === themeName) return;
    
    // Find the theme and check status and team count
    const theme = themes.find(t => t.themeName === themeName);
    
    // Check if theme is inactive
    if (theme && theme.status !== 'active') {
      toast.error('This theme is currently inactive and cannot be selected.');
      return;
    }
    
    if (theme && theme.teamCount >= 10) {
      setLimitedTheme(theme);
      setShowLimitModal(true);
      return;
    }
    
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
      setLastUpdateTime(Date.now()); // Update time after selection

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">


        {/* Header Section */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <div className="flex flex-row xs:flex-row items-start xs:items-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 lg:p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg flex-shrink-0">
              <Lightbulb className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900  break-words">Project Themes</h1>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-4xl leading-relaxed break-words">
                Choose a theme that inspires your hackathon project. Your selection guides your innovation journey.
              </p>
            </div>
          </div>
        </div>

        {/* Status Banners */}
        <div className="flex flex-row sm:flex-row items-center justify-center gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          {/* Live Update Banner */}
          <div className="w-full sm:w-auto">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                 <span className="text-green-600 font-semibold">Live Updates</span>
                <span className="hidden sm:inline"> - Auto sync</span>
              </span>
            </div>
          </div>

          {/* Deadline Banner */}
          <div className="w-full sm:w-auto">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg sm:rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 shadow-sm border border-gray-200">

              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">
                <span className="hidden sm:inline">Theme deadline: </span>
                <strong className="text-blue-600">Feb 25, 2026</strong>
              </span>
            </div>
          </div>
        </div>


        {/* Loading State */}
        {loading && themes.length === 0 && (
          <div className="flex justify-center items-center py-8 sm:py-12 lg:py-16 xl:py-20 mx-2 sm:mx-4 lg:mx-8">
            <div className="text-center bg-white rounded-lg sm:rounded-xl lg:rounded-2xl p-6 sm:p-8 lg:p-10 shadow-sm border border-gray-100">
              <Loader className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 text-blue-600 animate-spin mx-auto mb-3 sm:mb-4 lg:mb-6" />
              <div className="text-gray-600 font-medium text-sm sm:text-base lg:text-lg xl:text-xl">Loading themes...</div>
              <div className="text-gray-500 text-xs sm:text-sm lg:text-base mt-1 sm:mt-2 lg:mt-3">Preparing your innovation journey</div>
            </div>
          </div>
        )}

        {/* Theme Selection Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 mb-6 sm:mb-8 lg:mb-10">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.themeName;
            return (
              <div
                key={theme._id}
                className={`group relative bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm border-2 transition-all duration-300 ${
                  (theme.teamCount >= 10 || theme.status !== 'active') && !isSelected
                    ? 'opacity-60 cursor-not-allowed border-red-200'
                    : 'hover:shadow-lg hover:scale-[1.02]'
                } ${isSelected
                  ? 'border-green-500 shadow-lg ring-2 ring-green-100 scale-[1.02]'
                  : theme.teamCount >= 10 || theme.status !== 'active'
                    ? 'border-red-200'
                    : 'border-gray-200 hover:border-blue-300'
                  }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 lg:-top-4 lg:-right-4 z-10">
                    <div className="bg-green-500 text-white p-1 sm:p-1.5 lg:p-2 rounded-full shadow-lg border-2 sm:border-3 lg:border-4 border-white flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                      <span className="text-xs sm:text-sm font-semibold hidden sm:inline">SELECTED</span>
                    </div>
                  </div>
                )}

                <div className="p-3 sm:p-4 md:p-5 lg:p-6">
                  {/* Theme Header */}
                  <div className="flex items-start justify-between mb-2 sm:mb-3 lg:mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl leading-tight break-words flex-1">
                          {theme.themeName}
                        </h3>
                        {/* Theme Status Badge */}
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${
                          theme.status === 'active'
                            ? 'bg-green-100 text-green-800 border border-green-200'
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          <div className="flex items-center gap-1">
                            <div className={`w-1.5 h-1.5 rounded-full ${theme.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {theme.status === 'active' ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Team Count Display */}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{theme.teamCount || 0}/10 teams selected</span>
                        {theme.teamCount >= 10 && (
                          <span className="text-red-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Full
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Theme Content */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4 mb-3 sm:mb-4 lg:mb-6">
                    {/* Theme Short Description */}
                    <div className="mb-1 flex flex-col gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs sm:text-sm lg:text-base font-bold text-black mb-1">Theme Short Description</span>
                        <p className="text-gray-500 text-xs sm:text-sm lg:text-base break-words leading-relaxed" title={theme.themeShortDescription}>
                          {theme.themeShortDescription && theme.themeShortDescription.length > 60
                            ? theme.themeShortDescription.slice(0, 60) + '...'
                            : theme.themeShortDescription}
                        </p>
                      </div>
                      {theme.themeShortDescription && theme.themeShortDescription.length > 60 && (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline text-xs sm:text-sm font-semibold self-start transition-colors"
                          onClick={e => { e.stopPropagation(); setModalContent({ title: 'Theme Short Description', text: theme.themeShortDescription }); setModalOpen(true); }}
                        >
                          Read More
                        </button>
                      )}
                    </div>
                    {/* Theme Description */}
                    <div className="mb-2 sm:mb-3 flex flex-col gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs sm:text-sm lg:text-base font-bold text-black mb-1">Theme Description</span>
                        <p className="text-gray-600 text-xs sm:text-sm lg:text-base break-words leading-relaxed" title={theme.themeDescription}>
                          {theme.themeDescription && theme.themeDescription.length > 60
                            ? theme.themeDescription.slice(0, 60) + '...'
                            : theme.themeDescription}
                        </p>
                      </div>
                      {theme.themeDescription && theme.themeDescription.length > 60 && (
                        <button
                          type="button"
                          className="text-blue-600 hover:underline text-xs sm:text-sm font-semibold self-start transition-colors"
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
                    disabled={isSelected || (theme.teamCount >= 10 && !isSelected) || (theme.status !== 'active' && !isSelected)}
                    className={`w-full py-2 sm:py-2.5 lg:py-3 xl:py-3.5 px-3 sm:px-4 lg:px-6 rounded-lg sm:rounded-xl lg:rounded-2xl font-semibold text-xs sm:text-sm lg:text-base transition-all duration-200 ${isSelected
                      ? 'bg-green-100 text-green-700 border border-green-200 cursor-default'
                      : theme.teamCount >= 10 || theme.status !== 'active'
                        ? 'bg-red-100 text-red-600 border border-red-200 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-sm hover:shadow-lg transform hover:scale-[1.02]'
                      }`}
                  >
                    {isSelected ? (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span className="hidden xs:inline">Theme Selected</span>
                        <span className="xs:hidden">Selected</span>
                      </div>
                    ) : theme.teamCount >= 10 ? (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span className="hidden xs:inline">Theme Full (10/10)</span>
                        <span className="xs:hidden">Full</span>
                      </div>
                    ) : theme.status !== 'active' ? (
                      <div className="flex items-center justify-center gap-1 sm:gap-2 lg:gap-3">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                        <span className="hidden xs:inline">Theme Inactive</span>
                        <span className="xs:hidden">Inactive</span>
                      </div>
                    ) : (
                      <>
                        <span className="hidden sm:inline">Select This Theme</span>
                        <span className="sm:hidden">Select</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {!loading && themes.length === 0 && !error && (
          <div className="text-center py-12 sm:py-16 lg:py-20 xl:py-24 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-sm border border-blue-100 mx-2 sm:mx-4 lg:mx-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 lg:mb-8 shadow-lg">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              Theme Selection Temporarily Unavailable
            </h3>
            <div className="max-w-md sm:max-w-lg lg:max-w-xl mx-auto px-4 sm:px-6">
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 leading-relaxed">
                The Super Admin has not yet enabled theme selection for participants. 
              </p>
              <div className="bg-white rounded-lg border border-blue-200 p-4 sm:p-6 shadow-sm">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base mb-1 sm:mb-2">
                      What does this mean?
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                      Hackathon themes are currently being configured by the administration team. 
                      You will be notified once theme selection becomes available.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-gray-500 text-xs sm:text-sm mt-4 sm:mt-6">
                Please contact the hackathon organizers if you have any questions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-3 md:p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="theme-confirmation-title"
        >
          <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            <div className="p-3 sm:p-4 md:p-6 lg:p-8">
              {/* Modal Header */}
              <div className="text-center mb-3 sm:mb-4 md:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                  <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 id="theme-confirmation-title" className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Confirm Theme Selection
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">You're about to select the following theme:</p>
              </div>

              {/* Theme Preview */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 mb-3 sm:mb-4 md:mb-6 border border-blue-200">
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-sm sm:text-base md:text-lg lg:text-xl mb-1 sm:mb-2 break-words line-clamp-2">{pendingSelection}</div>
                  <div className="text-blue-600 font-medium text-xs sm:text-sm md:text-base">Ready to build amazing things!</div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Info className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm md:text-base text-yellow-800 font-medium break-words">
                      You can change your theme until Feb 25, 2026, 11:59 PM IST
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
                <button
                  onClick={confirmSelection}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm disabled:opacity-50 font-semibold text-xs sm:text-sm md:text-base"
                >
                  {loading ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      <span className="hidden xs:inline">Selecting...</span>
                      <span className="xs:hidden">...</span>
                    </div>
                  ) : (
                    <>
                      <span className="hidden xs:inline">Confirm Selection</span>
                      <span className="xs:hidden">Confirm</span>
                    </>
                  )}
                </button>

                <button
                  onClick={cancelSelection}
                  disabled={loading}
                  className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors font-semibold text-xs sm:text-sm md:text-base disabled:opacity-50"
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

      {/* Theme Limit Modal */}
      {showLimitModal && limitedTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Theme Selection Limit Reached
              </h3>
              
              <p className="text-gray-600 mb-4">
                <strong>"{limitedTheme.themeName}"</strong> has reached its maximum capacity of 10 teams. 
                Please select a different theme.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{limitedTheme.teamCount}/10</span> teams have already selected this theme.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLimitModal(false);
                    setLimitedTheme(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Choose Another Theme
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