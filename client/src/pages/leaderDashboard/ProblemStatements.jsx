import React, { useState, useEffect } from 'react';
import { problemStatementAPI } from '../../configs/api.js';
import { FileText, AlertCircle, Loader, Lightbulb, Calendar, Target, Users, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProblemStatements = () => {
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState('');
  const [showFetchOption, setShowFetchOption] = useState(false);
  const [hasTheme, setHasTheme] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingProblem, setPendingProblem] = useState(null);
  const [isDeactivatedMode, setIsDeactivatedMode] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [isPolling, setIsPolling] = useState(false);

  // Get teamId from user info or cookie
  const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser'));
  const teamId = hackathonUser?.team?._id || hackathonUser?.teamId || hackathonUser?.user?.teamId;

  // Check if team has selected a theme
  useEffect(() => {
    const checkTheme = () => {

      if (!teamId) {
        setError('Team ID not found');
        setLoading(false);
        return;
      }

      const teamTheme = hackathonUser?.theme?.themeName ||
        hackathonUser?.team?.teamTheme?.themeName ||
        sessionStorage.getItem('selectedTheme');



      if (teamTheme) {
        setHasTheme(true);
        setShowFetchOption(true);



        setTimeout(() => {
          fetchProblemStatements();
        }, 500);
      } else {
        setError('Please select a theme first before viewing problem statements');
        setHasTheme(false);

      }
      setLoading(false);
    };

    checkTheme();
  }, [teamId]);

  // Add real-time update polling
  useEffect(() => {
    if (!hasTheme || !teamId) return;

    const pollForUpdates = async () => {
      try {
        // Only poll if we already have problems loaded (to avoid initial load conflicts)
        if (availableProblems.length > 0 || selectedProblem) {
          setIsPolling(true);

          const res = await problemStatementAPI.getActiveForTeam(teamId);

          if (res.data) {
            const newIsDeactivated = res.data.isDeactivated || false;
            const currentTime = Date.now();

            // Check if activation/deactivation status changed
            if (newIsDeactivated !== isDeactivatedMode) {

              setIsDeactivatedMode(newIsDeactivated);
              setLastUpdateTime(currentTime);

              // Show toast notification about the change
              if (newIsDeactivated) {
                toast.warning('🔒 Problem statement selection has been deactivated by admin');
              } else {
                toast.success('✅ Problem statement selection is now active!');
              }

              // Refresh the problems list
              await fetchProblemStatements(true); // Silent refresh
            } else {
              // Update last check time even if no changes
              setLastUpdateTime(currentTime);
            }
          }
        }
      } catch (err) {
        // Silently handle polling errors to avoid spam

      } finally {
        setIsPolling(false);
      }
    };

    // Poll every 5 seconds
    const pollInterval = setInterval(pollForUpdates, 5000);

    return () => clearInterval(pollInterval);
  }, [hasTheme, teamId, isDeactivatedMode, availableProblems.length, selectedProblem]);

  // Function to fetch problem statements manually
  const fetchProblemStatements = async (isRefresh = false) => {

    if (!teamId) {

      setError('Team ID not found');
      return;
    }


    if (!isRefresh) {
      setLoading(true);
    }
    try {
      // Fetch available problem statements for team
      const res = await problemStatementAPI.getActiveForTeam(teamId);


      if (res.data.success) {
        const problems = res.data.problemStatements || [];
        const isDeactivated = res.data.isDeactivated || false;



        setAvailableProblems(problems);
        setIsDeactivatedMode(isDeactivated);

        // If deactivated, automatically set the selected problem (should be only one)
        if (isDeactivated && problems.length > 0) {

          setSelectedProblem(problems[0]);
          setError(''); // Clear any errors
          setShowFetchOption(false);
          setLoading(false);
          return;
        }

        // Check if team has already selected a problem
        const teamData = hackathonUser?.team;
        const selectedId = teamData?.selectedProblemStatement || teamData?.teamProblemStatement;

        if (selectedId) {

          const selected = problems.find(p => p._id === selectedId);
          if (selected) {

            setSelectedProblem(selected);
          } else {

            // If deactivated mode and team has selection but problem not in list,
            // try to fetch the specific problem details
            if (isDeactivated) {

              setSelectedProblem({
                _id: selectedId,
                PStitle: 'Previously Selected Problem Statement',
                PSdescription: 'Your team has already selected a problem statement. Details are being loaded...',
                PSTheme: { themeName: 'N/A' }
              });
            }
          }
        }

        setShowFetchOption(false); // Hide the fetch option after fetching
        setError(''); // Clear any previous errors

      } else {

        const isDeactivated = res.data.isDeactivated || false;

        if (isDeactivated) {
          // Problem statements are deactivated and team has no selection
          setError('Problem statements are currently deactivated by admin. Please contact support.');
          setAvailableProblems([]);
          setSelectedProblem(null);
        } else {
          setError(res.data.message || 'Failed to load problem statements');
        }
      }
    } catch (err) {

      // Check if it's a theme issue
      if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || 'Bad request';
        setError(errorMsg);

      } else if (err.message?.includes('theme')) {
        setError('Please select a theme first before viewing problem statements');
      } else {
        setError(err.response?.data?.message || 'Failed to load problem statements');
      }
    } finally {

      if (!isRefresh) {
        setLoading(false);
      }
      setLastUpdateTime(Date.now());
    }
  };

  // Manual refresh function
  const handleRefresh = () => {

    toast.info('Refreshing problem statements...');
    fetchProblemStatements(false); // Full refresh with loading
  };

  // Show confirmation modal before selection
  const handleSelectProblem = (problemStatement) => {
    // Check if problem statements are deactivated
    if (isDeactivatedMode) {
      toast.error('Problem statement selection is currently deactivated by admin');
      return;
    }

    // In activated mode, allow multiple selections (user can change their selection)

    setPendingProblem(problemStatement);
    setShowConfirmModal(true);
  };

  // Actual selection after confirmation
  const confirmSelection = async () => {
    if (!teamId || selecting || !pendingProblem) return;

    setSelecting(true);
    setShowConfirmModal(false);

    try {
      const res = await problemStatementAPI.selectForTeam(teamId, pendingProblem._id);

      if (res.data.success) {
        setSelectedProblem(pendingProblem);
        toast.success('Problem statement selected successfully!');


        // Keep all problems visible for potential selection changes


        // Update session storage
        const updatedUser = { ...hackathonUser };
        if (updatedUser.team) {
          updatedUser.team.selectedProblemStatement = pendingProblem._id;
          updatedUser.team.teamProblemStatement = pendingProblem._id;
          sessionStorage.setItem('hackathonUser', JSON.stringify(updatedUser));
        }
      } else {
        toast.error(res.data.message || 'Failed to select problem statement');
      }
    } catch (err) {

      toast.error(err.response?.data?.message || 'Failed to select problem statement');
    } finally {
      setSelecting(false);
      setPendingProblem(null);
    }
  };

  // Cancel selection
  const cancelSelection = () => {
    setShowConfirmModal(false);
    setPendingProblem(null);
  };

  if (loading) {
    return (
      <div className="overflow-hidden min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center w-full max-w-md">
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 animate-spin mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Loading Problem Statement</h3>
          <p className="text-gray-600 text-sm sm:text-base">Fetching your challenge details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    const isThemeError = error.includes('theme');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 mb-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">Problem Statements</h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">Choose your hackathon challenge</p>
              </div>
            </div>
          </div>

          <div className={`${isThemeError ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center`}>
            <AlertCircle className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${isThemeError ? 'text-yellow-600' : 'text-red-600'} mx-auto mb-3 sm:mb-4`} />
            <h3 className={`text-lg sm:text-xl font-semibold ${isThemeError ? 'text-yellow-800' : 'text-red-800'} mb-2`}>
              {isThemeError ? 'Theme Selection Required' : 'Error Loading Problem Statements'}
            </h3>
            <p className={`${isThemeError ? 'text-yellow-700' : 'text-red-700'} mb-4 text-sm sm:text-base`}>{error}</p>
            {isThemeError && (
              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 max-w-md mx-auto">
                <p className="text-xs sm:text-sm text-blue-700">
                  Go to the "Project Themes" section to select your team's theme first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No Team Theme State
  if (!loading && availableProblems.length === 0 && !selectedProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2">No Problem Statements Available</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              No problem statements are available for your team's theme, or your team hasn't selected a theme yet.
            </p>
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 max-w-md mx-auto">
              <p className="text-xs sm:text-sm text-blue-700">
                Please select a theme first, or contact organizers if you believe this is an error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="p-4 sm:p-6 md:p-8 mb-4 sm:mb-6">
          <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-row sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 ">Problem Statements</h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                  {selectedProblem
                    ? 'Your selected hackathon challenge'
                    : isDeactivatedMode
                      ? 'View available problem statements (Selection disabled)'
                      : 'Choose your hackathon challenge'
                  }
                </p>
              </div>
            </div>
            {/* Refresh Button and Status */}
            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors disabled:opacity-50 text-sm w-full sm:w-auto justify-center"
                title="Refresh problem statements"
              >
                <Loader className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-blue-500 animate-pulse' : isDeactivatedMode ? 'bg-orange-500' : 'bg-green-500'}`}></div>
                <span className="hidden xs:inline">
                  {isPolling ? 'Checking...' : isDeactivatedMode ? 'Deactivated' : 'Active'}
                </span>
                <span className="text-xs">Updated: {new Date(lastUpdateTime).toLocaleTimeString()}</span>
              </div>
            </div>

          </div>

          {/* Deactivated Mode Notice */}
          {isDeactivatedMode && !selectedProblem && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-orange-800 text-sm sm:text-base">Problem Statement Selection Deactivated</p>
                <p className="text-xs sm:text-sm text-orange-700 break-words">
                  Problem statement selection is currently disabled by admin.
                  {availableProblems.length > 0 ? ' You can view available problems but cannot select them.' : ''}
                </p>
              </div>
            </div>
          )}

          {!teamId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-yellow-800 text-sm sm:text-base">Team Not Found</p>
                <p className="text-xs sm:text-sm text-yellow-700 mt-1 break-words">
                  Please ensure you're part of a team to view problem statements.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Fetch Problem Statements Option */}
        {showFetchOption && hasTheme && (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 md:p-8 text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Ready to View Problem Statements?</h3>
            <p className="text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto text-sm sm:text-base">
              Your team has selected a theme. Click the button below to load available problem statements for your theme.
            </p>
            <button
              onClick={fetchProblemStatements}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  Loading Problem Statements...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Load Problem Statements
                </>
              )}
            </button>
          </div>
        )}

        {/* Selected Problem Details */}
        {selectedProblem && (
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 p-4 sm:p-5 md:p-6">
                <div>
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 break-words">{selectedProblem.PStitle}</h2>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Theme: {selectedProblem.PSTheme?.themeName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Selected: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 md:p-6">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    Problem Description
                  </h3>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg whitespace-pre-line break-words">
                      {selectedProblem.PSdescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Available Problem Statements */}
        {availableProblems.length > 0 && (
          <div className="space-y-4 sm:space-y-6 mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                All Available Problem Statements
                {isDeactivatedMode && (
                  <span className="text-xs sm:text-sm font-normal text-orange-600 ml-2">(View Only)</span>
                )}
              </h2>
              <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
                {isDeactivatedMode
                  ? 'Selection is currently disabled'
                  : selectedProblem
                    ? 'You can change your selection below'
                    : 'Choose one problem statement for your team'
                }
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {availableProblems.map((problemStatement, index) => {
                return (
                  <div key={problemStatement._id} className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-4 sm:p-5 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm sm:text-base">{index + 1}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{problemStatement.PStitle}</h3>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1">
                              Theme: {problemStatement.PSTheme?.themeName || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-3 sm:mb-4">
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                          {problemStatement.PSdescription}
                        </p>
                      </div>

                      <div className="flex justify-end">
                        {isDeactivatedMode ? (
                          <div className="bg-gray-100 text-gray-500 py-2 px-4 sm:px-6 rounded-lg font-medium text-sm">
                            🔒 Selection Disabled
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectProblem(problemStatement)}
                            disabled={selecting}
                            className={`py-2 px-4 sm:px-6 rounded-lg font-medium transition-colors disabled:opacity-50 text-xs sm:text-sm ${selectedProblem && selectedProblem._id === problemStatement._id
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                              }`}
                          >
                            {selecting ? (
                              <>
                                <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin inline mr-1 sm:mr-2" />
                                Selecting...
                              </>
                            ) : selectedProblem && selectedProblem._id === problemStatement._id ? (
                              <>
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                                Selected (Click to Change)
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                                Select This Problem
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}





        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Understand the Problem</h4>
            <p className="text-gray-600 text-xs sm:text-sm">Analyze requirements and identify key challenges</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Plan & Collaborate</h4>
            <p className="text-gray-600 text-xs sm:text-sm">Discuss approach and divide tasks with your team</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 text-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
              <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">Start Building</h4>
            <p className="text-gray-600 text-xs sm:text-sm">Begin developing your innovative solution</p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 md:p-6 transform transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                {selectedProblem ? 'Change Your Selection' : 'Confirm Your Selection'}
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm">
                {selectedProblem
                  ? 'You can change your problem statement selection'
                  : 'Please confirm your problem statement choice'
                }
              </p>
            </div>

            {/* Problem Statement Preview */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">Selected Problem Statement:</h4>
              <p className="text-gray-700 font-medium text-sm sm:text-base break-words">{pendingProblem?.PStitle}</p>
              <p className="text-gray-600 text-xs sm:text-sm mt-2 line-clamp-3 break-words">{pendingProblem?.PSdescription}</p>
            </div>

            {/* Warning Message */}
            <div className={`${selectedProblem ? 'bg-blue-50 border-blue-200' : 'bg-yellow-50 border-yellow-200'} border rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6`}>
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedProblem ? 'text-blue-600' : 'text-yellow-600'} mt-0.5 flex-shrink-0`} />
                <div className="text-xs sm:text-sm">
                  <p className={`${selectedProblem ? 'text-blue-800' : 'text-yellow-800'} font-semibold mb-1`}>
                    {selectedProblem ? '🔄 Changing Selection' : '⚠️ Important Notice'}
                  </p>
                  <p className={selectedProblem ? 'text-blue-700' : 'text-yellow-700'}>
                    {selectedProblem
                      ? 'You can change your problem statement. This selection will replace your previous one.'
                      : 'You are selecting a problem statement. You can change it later if you wish.'
                    }
                  </p>

                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={cancelSelection}
                disabled={selecting}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                disabled={selecting}
                className={`flex-1 px-3 sm:px-4 py-2 sm:py-3 text-white rounded-lg sm:rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${selectedProblem ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
              >
                {selecting ? (
                  <>
                    <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                    {selectedProblem ? 'Changing...' : 'Selecting...'}
                  </>
                ) : (
                  selectedProblem ? 'Yes, Change Selection' : 'Yes, Select This Problem'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemStatements;