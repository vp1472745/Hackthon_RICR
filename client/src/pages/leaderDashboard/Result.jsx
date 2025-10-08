import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Star,
  Award,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Loader,
  Target
} from 'lucide-react';
import { userAPI } from '../../configs/api';
import { toast } from 'react-hot-toast';

const Result = () => {
  // State management
  const [teamData, setTeamData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user from session
  const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
  const currentUser = hackathonUser?.user;

  console.log('Rendering results', resultData);
  
  const fetchResultData = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!currentUser?._id) {
        throw new Error('User not found in session');
      }
      // Fetch results for the user's team
      const response = await userAPI.getResult();

      if (response.data && Array.isArray(response.data.results)) {
        const reviewed = response.data.results.find(r => r.status === 'Reviewed') || response.data.results[0] || null;
        setResultData(reviewed);
      } else {
        setResultData(null);
      }
    } catch (err) {
      console.error('Error fetching result data:', err);
      setError(err.message || 'Failed to fetch result data');
      toast.error('Failed to load result data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch team data and results
  useEffect(() => {
    fetchTeamData();
    fetchResultData();
  }, []);

  const fetchTeamData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser?._id) {
        throw new Error('User not found in session');
      }

      // Fetch user data with team information
      const response = await userAPI.getUserById(currentUser._id);
      if (response.data && response.data.user) {
        const userData = response.data.user;
        setTeamData({
          teamInfo: userData.teamId,
          teamMembers: userData.teamInfo || {},
          user: userData
        });
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError(err.message || 'Failed to fetch team data');
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading team data...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTeamData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Competition Results</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your team's progress and submit project</p>
            </div>
          </div>
          <button
            onClick={fetchTeamData}
            className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Results & Awards Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" />
            Results & Awards
          </h2>

          {resultData ? (
            <div className="space-y-6">
              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                  <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-600 mx-auto mb-3 sm:mb-4" />
                  <div className="text-2xl sm:text-3xl font-bold text-yellow-800 mb-2">{resultData?.rank ?? 'TBD'}</div>
                  <div className="text-sm text-yellow-700 font-medium">Final Position</div>
                  <div className="text-xs text-yellow-600 mt-1">{resultData?.status === 'Reviewed' ? 'Result published' : 'Result pending'}</div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
                  <div className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
                    {typeof resultData?.obtainedMarks === 'number' ? resultData.obtainedMarks.toFixed(2) : 0}
                  </div>
                  <div className="text-sm text-blue-700 font-medium">Total Score</div>
                  <div className="text-xs text-blue-600 mt-1">Out of 100 points</div>
                </div>

                <div className="text-center p-4 sm:p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <Award className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-600 mx-auto mb-3 sm:mb-4" />
                  <div className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">{resultData?.grade ?? 'TBD'}</div>
                  <div className="text-sm text-green-700 font-medium">Grade</div>
                  <div className="text-xs text-green-600 mt-1">Performance rating</div>
                </div>
              </div>

              {/* Detailed Category Scores */}
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 bg-gray-50 border border-gray-100 rounded-xl">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-gray-600" />
                  Category Scores
                </h3>
                
                {/* Desktop Grid View */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { label: 'UI', value: resultData.ui, color: 'border-purple-200 bg-purple-50' },
                    { label: 'UX', value: resultData.ux, color: 'border-blue-200 bg-blue-50' },
                    { label: 'Presentation', value: resultData.presentation, color: 'border-green-200 bg-green-50' },
                    { label: 'Code Quality', value: resultData.codeQuality, color: 'border-indigo-200 bg-indigo-50' },
                    { label: 'Viva', value: resultData.viva, color: 'border-orange-200 bg-orange-50' },
                    { label: 'Overall', value: resultData.overAll, color: 'border-yellow-200 bg-yellow-50' }
                  ].map((category, index) => (
                    <div key={index} className={`p-4 border rounded-lg ${category.color}`}>
                      <div className="text-sm text-gray-500">{category.label}</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {typeof category.value === 'number' ? category.value : '-'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Grid View */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                  {[
                    { label: 'UI', value: resultData.ui, color: 'border-purple-200 bg-purple-50' },
                    { label: 'UX', value: resultData.ux, color: 'border-blue-200 bg-blue-50' },
                    { label: 'Presentation', value: resultData.presentation, color: 'border-green-200 bg-green-50' },
                    { label: 'Code Quality', value: resultData.codeQuality, color: 'border-indigo-200 bg-indigo-50' },
                    { label: 'Viva', value: resultData.viva, color: 'border-orange-200 bg-orange-50' },
                    { label: 'Overall', value: resultData.overAll, color: 'border-yellow-200 bg-yellow-50' }
                  ].map((category, index) => (
                    <div key={index} className={`p-3 border rounded-lg ${category.color}`}>
                      <div className="text-xs text-gray-500">{category.label}</div>
                      <div className="text-xl font-bold text-gray-900">
                        {typeof category.value === 'number' ? category.value : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 sm:p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500 mx-auto mb-3" />
              <p className="text-yellow-700 text-sm sm:text-base">Result not declared yet</p>
              <p className="text-yellow-600 text-xs sm:text-sm mt-1">Check back later for your competition results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;