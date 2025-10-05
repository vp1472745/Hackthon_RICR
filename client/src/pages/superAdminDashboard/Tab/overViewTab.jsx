import React, { useEffect, useState } from 'react';
import {  FiLayers, FiAward, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { BsMicrosoftTeams } from 'react-icons/bs';
import { AdminAPI } from '../../../configs/api';

const OverviewTab = ({ onTabChange }) => {
  const [stats, setStats] = useState({ users: 0, themes: 0, problems: 0, teams: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersRes, themesRes, problemsRes, teamsRes] = await Promise.all([
        AdminAPI.getAllUsers(),
        AdminAPI.getAllThemes(),
        AdminAPI.getAllProblemStatementsAdmin(),
        AdminAPI.getAllTeams(),
      ]);
      setStats({
        users: usersRes.data.length || 0,
        themes: themesRes.data.themes?.length || 0,
        problems: problemsRes.data.problemStatements?.length || 0,
        teams: teamsRes.data.teams?.length || 0,
      });
    } catch (err) {
      setError('Failed to fetch dashboard stats');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50" style={{maxHeight: 'calc(100vh - 48px)'}}>
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-blue-900 text-center xs:text-left">Dashboard Overview</h1>
        <button
          onClick={fetchStats}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition text-sm sm:text-base min-w-[120px]"
          disabled={loading}
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} /> 
          <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-center text-red-600 mb-4 text-sm sm:text-base px-2">
          {error}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {/* Users Card */}
        <div
          className="bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center text-center border border-blue-50 hover:shadow-lg transition cursor-pointer hover:bg-blue-50"
          onClick={() => onTabChange && onTabChange('Team')}
          title="Go to Team Manage"
        >
          <BsMicrosoftTeams size={24} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-500 mb-1 sm:mb-2" />
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-800 mb-1">{stats.users}</div>
          <div className="text-gray-500 text-xs sm:text-sm font-medium">Total Users</div>
        </div>

        {/* Themes Card */}
        <div
          className="bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center text-center border border-green-50 hover:shadow-lg transition cursor-pointer hover:bg-green-50"
          onClick={() => onTabChange && onTabChange('Theme')}
          title="Go to Theme Manage"
        >
          <FiLayers size={24} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-500 mb-1 sm:mb-2" />
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-700 mb-1">{stats.themes}</div>
          <div className="text-gray-500 text-xs sm:text-sm font-medium">Total Themes</div>
        </div>

        {/* Problem Statements Card */}
        <div
          className="bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center text-center border border-yellow-50 hover:shadow-lg transition cursor-pointer hover:bg-yellow-50"
          onClick={() => onTabChange && onTabChange('Ps')}
          title="Go to PS Manage"
        >
          <FiFileText size={24} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-yellow-500 mb-1 sm:mb-2" />
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-yellow-700 mb-1">{stats.problems}</div>
          <div className="text-gray-500 text-xs sm:text-sm font-medium">Total Problem Statements</div>
        </div>

        {/* Teams Card */}
        <div
          className="bg-white rounded-xl shadow-md p-3 sm:p-4 lg:p-6 flex flex-col items-center justify-center text-center border border-purple-50 hover:shadow-lg transition cursor-pointer hover:bg-purple-50"
          onClick={() => onTabChange && onTabChange('Team')}
          title="Go to Team Manage"
        >
          <BsMicrosoftTeams size={24} className="sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-500 mb-1 sm:mb-2" />
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-700 mb-1">{stats.teams}</div>
          <div className="text-gray-500 text-xs sm:text-sm font-medium">Total Teams</div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;