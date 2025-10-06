import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Star,
  Users,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Upload,
  ExternalLink,
  Github,
  Video,
  Globe,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Timer,
  Eye,
  Edit3,
  FileText,
  Download,
  Loader
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

      if (response.data && response.data.results) {
        setResultData(response.data.results);
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

        // Initialize submission data with existing team project link if available
        if (userData.teamId?.projectGithubLink) {
          setSubmissionData(prev => ({
            ...prev,
            projectGithubLink: userData.teamId.projectGithubLink
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching team data:', err);
      setError(err.message || 'Failed to fetch team data');
      toast.error('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };




  const phases = [
    {
      name: 'Registration',
      status: teamData?.user ? 'completed' : 'pending',
      date: '2025-10-01',
      description: 'Team registration completed'
    },
    {
      name: 'Theme Selection',
      status: teamData?.teamInfo?.teamTheme ? 'completed' : 'pending',
      date: '2025-10-02',
      description: 'Project theme selected'
    },
    {
      name: 'Problem Selection',
      status: teamData?.teamInfo?.teamProblemStatement ? 'completed' : 'pending',
      date: '2025-10-03',
      description: 'Problem statement selected'
    },
    {
      name: 'Development Phase',
      status: 'in-progress',
      date: '2025-10-04 - 2025-10-06',
      description: 'Current development phase'
    },
    {
      name: 'Submission',
      status: teamData?.teamInfo?.projectGithubLink ? 'completed' : 'pending',
      date: '2025-10-06',
      description: 'Final submission deadline'
    },
    {
      name: 'Evaluation',
      status: 'pending',
      date: '2025-10-07',
      description: 'Judging and evaluation'
    },
    {
      name: 'Results',
      status: 'pending',
      date: '2025-10-07',
      description: 'Final results announcement'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'in-progress':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-gray-600 bg-gray-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-gray-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
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
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Competition Results</h1>
              <p className="text-gray-600 mt-1">Track your team's progress and submit project</p>
            </div>
          </div>
          <button
            onClick={fetchTeamData}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Results & Awards Section */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-purple-500" />
            Results & Awards
          </h2>

         { resultData && resultData.length > 0 ? ( <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-800 mb-2">{resultData[0]?.rank || 'TBD'}</div>
              <div className="text-sm text-yellow-700 font-medium">Final Position</div>
              <div className="text-xs text-yellow-600 mt-1">Results pending evaluation</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-800 mb-2">{resultData[0]?.obtainedMarks.toFixed(2) || 0}</div>
              <div className="text-sm text-blue-700 font-medium">Total Score</div>
              <div className="text-xs text-blue-600 mt-1">Out of 100 points</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-800 mb-2">{resultData[0]?.grade || 'TBD'}</div>
              <div className="text-sm text-green-700 font-medium">Grade</div>
              <div className="text-xs text-green-600 mt-1">Performance rating</div>
            </div>
          </div>) : (
            <div className="text-center p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
              <p className="text-yellow-700">Result not declared yet</p>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Important Dates</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex gap-5">
                <span className="text-gray-600">Submission Deadline:</span>
                <span className="font-medium text-gray-900">October 6, 2025 - 11:59 PM</span>
              </div>
              <div className="flex gap-5">
                <span className="text-gray-600">Results Announcement:</span>
                <span className="font-medium text-gray-900">October 7, 2025 - 6:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Competition Timeline
          </h2>

          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex-shrink-0">
                  {getStatusIcon(phase.status)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                      {phase.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {phase.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Result;