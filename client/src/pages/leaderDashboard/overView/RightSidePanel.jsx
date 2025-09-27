import React, { useEffect, useState, useCallback } from 'react';
import {
  Target,
  FileText,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { problemStatementAPI, userAPI } from '../../../configs/api';

const RightSidePanel = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [error, setError] = useState('');

  // Helper to safely parse localStorage JSON
  const safeParse = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };

  // Normalize response shape to pick a problem object (same logic used in ProblemStatements)
  const extractProblemFromResponse = (data) => {
    if (!data) return null;
    if (data.problemStatements && Array.isArray(data.problemStatements) && data.problemStatements.length > 0) {
      return data.problemStatements[0];
    } else if (data.problems && Array.isArray(data.problems) && data.problems.length > 0) {
      return data.problems[0];
    } else if (data.problemStatement) {
      return data.problemStatement;
    } else if (data.problem) {
      return data.problem;
    }
    return null;
  };

  // Primary function: try to fetch problem statement by teamId (from localStorage or via API fallback)
  const fetchProblemStatementByTeam = useCallback(async (teamId) => {
    if (!teamId) return null;
    try {
      const res = await problemStatementAPI.getByTeam(teamId);
      if (res?.data) {
        const found = extractProblemFromResponse(res.data);
        return found;
      }
      return null;
    } catch (err) {
      console.error('Error fetching problem statement by team:', err);
      return null;
    }
  }, []);

  // Try to get user data from API (fallback), return user object or null
  const fetchUserFromApi = useCallback(async (userId) => {
    if (!userId) return null;
    try {
      const resp = await userAPI.getUserById(userId);
      if (resp?.data?.user) return resp.data.user;
      return null;
    } catch (err) {
      console.error('Error fetching user by id:', err);
      return null;
    }
  }, []);

  const fetchThemeByTeamId = async () => {
    try {
      setLoadingProblem(true);
      setError('');

      const userId = JSON.parse(localStorage.getItem('hackathonUser'))?.user?._id;
      if (!userId) {
        setError('User ID not found');
        return;
      }

      const response = await userAPI.getUserById(userId);
      if (response.data && response.data.user) {
        const teamTheme = response.data.user.teamInfo?.team?.teamTheme;
        if (teamTheme) {
          setSelectedTheme(teamTheme.themeName);
          localStorage.setItem('selectedTheme', teamTheme.themeName);
        } else {
          setSelectedTheme(null);
        }
      }
    } catch (err) {
      console.error('Error fetching theme by team ID:', err);
      setError('Failed to fetch theme');
    } finally {
      setLoadingProblem(false);
    }
  };

  const loadThemeAndProblem = useCallback(async () => {
    setLoadingProblem(true);
    setError('');
    setProblem(null);
    setSelectedTheme(null);

    try {
      const hackathonUser = safeParse('hackathonUser') || {};
      // teamId may be in several places; try them in order
      let teamId =
        hackathonUser?.team?._id ||
        hackathonUser?.teamId ||
        hackathonUser?.user?.teamId ||
        hackathonUser?.user?.team?._id ||
        null;

      let userObj = hackathonUser?.user || null;

      // If no teamId but there is a logged-in user id, fetch user from API to discover teamInfo
      if (!teamId && hackathonUser?.user?._id) {
        userObj = await fetchUserFromApi(hackathonUser.user._id);
        teamId =
          userObj?.teamId ||
          userObj?.team?._id ||
          userObj?.teamInfo?.team?._id ||
          userObj?.teamInfo?.teamId ||
          null;
      }

      // If we have a user object and it contains teamInfo with teamTheme / teamProblemStatement, use it
      if (userObj && userObj.teamInfo) {
        const teamInfo = userObj.teamInfo;
        const themeName =
          teamInfo?.team?.teamTheme?.themeName ||
          teamInfo?.teamTheme?.themeName ||
          teamInfo?.team?.teamTheme ||
          null;

        if (themeName) {
          setSelectedTheme(themeName);
          localStorage.setItem('selectedTheme', themeName);
        }

        const teamProblem =
          teamInfo?.team?.teamProblemStatement ||
          teamInfo?.teamProblemStatement ||
          teamInfo?.team?.teamProblem ||
          null;

        if (teamProblem) {
          setProblem({
            PStitle: teamProblem?.PStitle || teamProblem?.title || '',
            PSdescription: teamProblem?.PSdescription || teamProblem?.description || ''
          });
          // We already have the most reliable source, so finish early
          setLoadingProblem(false);
          return;
        }
      }

      // If we still don't have a problem, attempt to fetch from problemStatementAPI using teamId
      if (teamId) {
        const fetchedProblem = await fetchProblemStatementByTeam(teamId);
        if (fetchedProblem) {
          setProblem(fetchedProblem);
          // Optionally persist to localStorage for offline use
          try {
            localStorage.setItem('selectedTheme', selectedTheme || '');
            localStorage.setItem('apiTeamProblem', JSON.stringify(fetchedProblem));
          } catch (e) {
            // ignore localStorage write errors
          }
          setLoadingProblem(false);
          return;
        }
      }

      // Last resort: check localStorage stored problem (from other parts of the app)
      const storedProblem = safeParse('apiTeamProblem') || safeParse('leaderProfile')?.teamInfo?.team?.teamProblemStatement;
      if (storedProblem) {
        setProblem(storedProblem);
        setLoadingProblem(false);
        return;
      }

      // No problem found
      setProblem(null);
    } catch (err) {
      console.error('Error in loadThemeAndProblem:', err);
      setError('Failed to fetch theme/problem statement');
    } finally {
      setLoadingProblem(false);
    }
  }, [fetchProblemStatementByTeam, fetchUserFromApi, selectedTheme]);

  useEffect(() => {
    loadThemeAndProblem();
    fetchThemeByTeamId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Manual refresh control
  const handleRefresh = async () => {
    await loadThemeAndProblem();
  };

  return (
    <div className="space-y-6">
     {/* Theme Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Target className="w-6 h-6 text-[#0B2A4A]" />
            <h2 className="text-lg font-semibold text-gray-800">Selected Theme</h2>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-3">
            {selectedTheme ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Selected
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-yellow-600">
                <AlertTriangle className="w-4 h-4" />
                Not Selected
              </span>
            )}
          </div>
        </div>

        {selectedTheme ? (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-2">{selectedTheme}</h3>
            <p className="text-sm text-gray-600">This is your selected theme for the hackathon.</p>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No theme selected yet</p>
            <p className="text-xs mt-1">Please select a theme to proceed with your project.</p>
          </div>
        )}
      </div>

      {/* Problem Statement */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-[#0B2A4A]" />
            <h2 className="text-lg font-semibold text-gray-800">Problem Statement</h2>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-3">
            {!loadingProblem && problem ? (
              <span className="inline-flex items-center gap-1 text-green-600">
                <CheckCircle className="w-4 h-4" />
                Assigned
              </span>
            ) : null}
            {error ? (
              <span className="inline-flex items-center gap-1 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                Error
              </span>
            ) : null}
          </div>
        </div>

        {loadingProblem ? (
          <div className="text-center text-gray-600">Loading problem statement...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : problem && problem.PStitle ? (
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-2">{problem.PStitle}</h3>
              <p className="text-sm text-gray-600 line-clamp-4 whitespace-pre-line">{problem.PSdescription || 'No description provided.'}</p>
            </div>
            <div className="flex gap-2">
              <a
                role="button"
                onClick={() => {
                  // show full problem in a new window/tab or modal depending on app design
                  // fallback: open a simple printable view
                  const w = window.open('', '_blank');
                  if (w) {
                    w.document.write(`<html><head><title>${problem.PStitle}</title></head><body><h1>${problem.PStitle}</h1><pre style="white-space:pre-wrap;font-family:system-ui;">${problem.PSdescription || ''}</pre></body></html>`);
                    w.document.close();
                  }
                }}
                className="inline-flex items-center gap-2 px-3 py-2 bg-[#0B2A4A] text-white rounded-md text-sm font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0B2A4A]"
              >
                <FileText className="w-4 h-4" />
                View Full
              </a>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0B2A4A]"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">Problem statement not assigned yet</p>
            <p className="text-xs mt-1">It will appear here once organizers assign it or after theme selection.</p>
          </div>
        )}
      </div>

 
    </div>
  );
};

export default RightSidePanel;
