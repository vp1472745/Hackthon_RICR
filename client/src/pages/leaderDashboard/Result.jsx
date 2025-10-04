import React from 'react';
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
  CheckCircle
} from 'lucide-react';

const Result = () => {
  // Sample result data - replace with actual data from API
  const resultData = {
    teamName: 'Team Alpha',
    position: 'TBD',
    status: 'In Progress',
    submissionTime: null,
    score: null,
    category: 'Innovation Track'
  };

  const phases = [
    {
      name: 'Registration',
      status: 'completed',
      date: '2025-09-20',
      description: 'Team registration completed'
    },
    {
      name: 'Problem Selection',
      status: 'completed', 
      date: '2025-09-21',
      description: 'Problem statement selected'
    },
    {
      name: 'Development Phase',
      status: 'in-progress',
      date: '2025-09-22 - 2025-09-24',
      description: 'Current development phase'
    },
    {
      name: 'Submission',
      status: 'pending',
      date: '2025-09-24',
      description: 'Final submission deadline'
    },
    {
      name: 'Evaluation',
      status: 'pending',
      date: '2025-09-25',
      description: 'Judging and evaluation'
    },
    {
      name: 'Results',
      status: 'pending',
      date: '2025-09-25',
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 min-w-[55vh]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Competition Results</h1>
            <p className="text-gray-600 mt-1">Track your progress and final standings</p>
          </div>
        </div>
      </div>

      {/* Current Status Card */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-500" />
              Current Status
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor('in-progress')}`}>
              {resultData.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{resultData.position}</div>
              <div className="text-sm text-gray-600">Current Position</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Star className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{resultData.score || 'TBD'}</div>
              <div className="text-sm text-gray-600">Current Score</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{resultData.category}</div>
              <div className="text-sm text-gray-600">Category</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
            Competition Timeline
          </h2>

          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100">
                <div className="flex-shrink-0">
                  {getStatusIcon(phase.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900">{phase.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)}`}>
                      {phase.status.replace('-', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{phase.description}</p>
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

      {/* Submission Info */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Medal className="w-6 h-6 text-purple-500" />
            Submission Details
          </h2>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Submission Status</span>
            </div>
            <p className="text-blue-700 text-sm">
              {resultData.submissionTime 
                ? `Submitted on ${resultData.submissionTime}`
                : 'Not submitted yet. Make sure to submit before the deadline!'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Submission Deadline</h4>
              <p className="text-gray-600 text-sm">September 24, 2025 at 11:59 PM</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Results Announcement</h4>
              <p className="text-gray-600 text-sm">September 25, 2025 at 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Result;