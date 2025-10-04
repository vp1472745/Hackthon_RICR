import React, { useEffect, useState } from 'react';
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

  // cookie helper
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  const teamId = getCookie('teamId');

  useEffect(() => {
    if (!teamId) {
      console.warn('Team ID not found in cookies. Some features may not work.');
    }
  }, [teamId]);

  useEffect(() => {
    let mounted = true;
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const res = await projectThemeAPI.getAllThemes();
        if (!mounted) return;
        setThemes(res?.data?.themes || []);
        setError('');
      } catch (err) {
        console.error('Error fetching themes:', err);
        if (!mounted) return;
        setError('Failed to load themes. Please try again later.');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchThemes();
    return () => { mounted = false; };
  }, []);

  // fetch selected theme for team (based on logged-in user)
  useEffect(() => {
    let mounted = true;
    const fetchTeamThemeByUserId = async () => {
      try {
        const userId = JSON.parse(sessionStorage.getItem('hackathonUser'))?.user?._id;
        if (!userId) {
          console.debug('User ID not found in sessionStorage.');
          return;
        }
        const response = await userAPI.getUserById(userId);
        if (!mounted) return;
        const teamTheme = response?.data?.user?.teamInfo?.team?.teamTheme;
        if (teamTheme) setSelectedTheme(teamTheme.themeName);
      } catch (err) {
        console.error('Error fetching team theme by user ID:', err);
        if (!mounted) return;
        setError('Failed to fetch team theme. Please try again later.');
      }
    };
    fetchTeamThemeByUserId();
    return () => { mounted = false; };
  }, []);

  // NOTE: Current requirement: members cannot select themes — selection disabled here.
  // If you want leaders to select, plug in a check for leader role and call handleThemeSelect.
  const handleThemeSelect = (themeName) => {
    // Example: if leader: setPendingSelection(themeName); setShowConfirmation(true);
    // currently disabled for members / UI is read-only; keep this function reserved.
    // return;
    // If you'd like to allow leader selection, uncomment the block below and add role-checking.
    /*
    if (!isLeader) {
      alert('Only team leaders can select themes.');
      return;
    }
    setPendingSelection(themeName);
    setShowConfirmation(true);
    */
  };

  const confirmSelection = async () => {
    if (!teamId || !pendingSelection) return;
    setLoading(true);
    try {
      await projectThemeAPI.selectThemeForTeam(teamId, pendingSelection);
      setSelectedTheme(pendingSelection);
      setShowConfirmation(false);
      setPendingSelection(null);

      // refresh auth/user data in session
      const refresh_response = await authAPI.refreshData();
      if (refresh_response?.data) {
        const prevLoginTime = (JSON.parse(sessionStorage.getItem('hackathonUser') || '{}')).loginTime;
        sessionStorage.setItem('hackathonUser', JSON.stringify({
          email: refresh_response.data.user?.email,
          user: refresh_response.data.user,
          team: refresh_response.data.team,
          theme: refresh_response.data.theme,
          ProblemStatements: refresh_response.data.ProblemStatements,
          loginTime: prevLoginTime || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error('confirmSelection error:', err);
      alert('Failed to select theme. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cancelSelection = () => {
    setShowConfirmation(false);
    setPendingSelection(null);
  };

  // small util to shorten text for card preview
  const excerpt = (text = '', n = 80) => {
    if (!text) return '';
    return text.length > n ? text.slice(0, n) + '…' : text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Lightbulb className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">Project Themes</h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl">
                Choose a theme that inspires your hackathon project. Your selection guides your innovation journey.
              </p>
            </div>
          </div>
        </div>

        {/* Deadline banner */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-200">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              Theme selection deadline: <strong className="text-blue-600">November 6, 2025</strong>
            </span>
          </div>
        </div>

        {/* Loading state */}
        {loading && themes.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <div className="text-gray-600 font-medium">Loading themes...</div>
              <div className="text-gray-500 text-sm mt-2">Preparing your innovation journey</div>
            </div>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {themes.map(theme => {
            const isSelected = selectedTheme === theme.themeName;
            return (
              <article
                key={theme._id}
                aria-labelledby={`theme-${theme._id}-title`}
                className={`relative group bg-white rounded-2xl border-2 transition-all duration-300 overflow-hidden
                  ${isSelected ? 'border-green-500 shadow-lg ring-2 ring-green-100' : 'border-gray-200 hover:border-blue-300 hover:shadow-md'}`}
              >
                {/* selected badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-20">
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg border-4 border-white flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      <span className="sr-only">Selected</span>
                    </div>
                  </div>
                )}

                <div className="p-5 flex flex-col h-full">
                  <header className="mb-3">
                    <h3 id={`theme-${theme._id}-title`} className="font-semibold text-gray-900 text-lg">
                      {theme.themeName}
                    </h3>
                  </header>

                  <div className="flex-1 space-y-3">
                    <div>
                      <span className="block text-xs font-bold text-black mb-1">Short Description</span>
                      <p className="text-gray-600 text-sm" title={theme.themeShortDescription}>
                        {excerpt(theme.themeShortDescription, 80)}
                      </p>
                      {theme.themeShortDescription && theme.themeShortDescription.length > 80 && (
                        <button
                          type="button"
                          className="mt-2 text-blue-600 hover:underline text-xs font-medium"
                          onClick={(e) => { e.stopPropagation(); setModalContent({ title: 'Theme Short Description', text: theme.themeShortDescription }); setModalOpen(true); }}
                        >
                          Read more
                        </button>
                      )}
                    </div>

                    <div>
                      <span className="block text-xs font-bold text-black mb-1">Description</span>
                      <p className="text-gray-600 text-sm" title={theme.themeDescription}>
                        {excerpt(theme.themeDescription, 120)}
                      </p>
                      {theme.themeDescription && theme.themeDescription.length > 120 && (
                        <button
                          type="button"
                          className="mt-2 text-blue-600 hover:underline text-xs font-medium"
                          onClick={(e) => { e.stopPropagation(); setModalContent({ title: 'Theme Description', text: theme.themeDescription }); setModalOpen(true); }}
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  </div>

                  <footer className="mt-4">
                    <div className={`w-full py-3 rounded-xl font-semibold text-sm text-center ${isSelected ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
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

                    <div className="mt-3 flex flex-col sm:flex-row gap-3">
                      {/* Disabled selection button (read-only for members). If you want leaders to pick, enable logic here. */}
                      <button
                        type="button"
                        onClick={() => handleThemeSelect(theme.themeName)}
                        disabled
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition ${isSelected ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        aria-disabled="true"
                        title="Only team leaders can select themes"
                      >
                        {isSelected ? 'Selected' : 'Select Theme (Leaders Only)'}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setModalContent({ title: theme.themeName, text: theme.themeDescription || theme.themeShortDescription || 'No further details.' }); setModalOpen(true); }}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50"
                      >
                        View Details
                      </button>
                    </div>
                  </footer>
                </div>
              </article>
            );
          })}
        </div>

        {/* Empty state */}
        {!loading && themes.length === 0 && !error && (
          <div className="mt-8 text-center bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Themes Available</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">We're curating exciting themes for your hackathon. Please check back soon.</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 text-center text-red-600 font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Confirmation Modal (leader selection) */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black opacity-40" onClick={cancelSelection} aria-hidden />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold">Confirm Theme Selection</h3>
                <p className="text-sm text-gray-600 mt-2">You're about to select the following theme:</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100 text-center">
                <div className="font-semibold text-gray-900">{pendingSelection}</div>
                <div className="text-xs text-gray-600">Ready to build amazing things!</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm text-yellow-800">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    You can change your theme until <strong>November 6, 2025</strong>.
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirmSelection}
                  disabled={loading}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" /> Selecting...
                    </>
                  ) : 'Confirm Selection'}
                </button>

                <button
                  onClick={cancelSelection}
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="absolute inset-0 bg-black opacity-30" onClick={() => setModalOpen(false)} aria-hidden />
          <div className="relative w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold">{modalContent.title}</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setModalOpen(false)} aria-label="Close details">✕</button>
            </div>
            <div className="p-5 max-h-[70vh] overflow-auto">
              <div className="prose prose-sm max-w-none text-gray-700">
                <p style={{ whiteSpace: 'pre-line' }}>{modalContent.text}</p>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button className="w-full py-2 rounded-lg bg-blue-600 text-white" onClick={() => setModalOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTheme;
