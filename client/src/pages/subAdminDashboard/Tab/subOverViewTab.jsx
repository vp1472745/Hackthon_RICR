import React, { useEffect, useState } from 'react';
import {  FiLayers, FiAward, FiRefreshCw, FiFileText } from 'react-icons/fi';
import { BsMicrosoftTeams } from 'react-icons/bs';
import { subAdminAPI } from '../../../configs/api';
import PermissionWrapper from '../../../components/PermissionWrapper';
import usePermissions from '../../../hooks/usePermissions';



const OverviewTab = ({ onTabChange }) => {
  const [stats, setStats] = useState({ users: 0, themes: 0, problems: 0, teams: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { hasPermission, loading: permissionsLoading } = usePermissions();

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const promises = [];
      
      // Always try to fetch all data, let server handle permissions
      promises.push(
        subAdminAPI.getAllUsers().catch(() => ({ data: [] })),
        subAdminAPI.getAllThemes().catch(() => ({ data: { themes: [] } })),
        subAdminAPI.getAllProblemStatementsAdmin().catch(() => ({ data: { problemStatements: [] } })),
        subAdminAPI.getAllTeams().catch(() => ({ data: { teams: [] } }))
      );
      
      const [usersRes, themesRes, problemsRes, teamsRes] = await Promise.all(promises);
      
      setStats({
        users: usersRes.data.length || 0,
        themes: themesRes.data.themes?.length || 0,
        problems: problemsRes.data.problemStatements?.length || 0,
        teams: teamsRes.data.teams?.length || 0,
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to fetch dashboard stats');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!permissionsLoading) {
      fetchStats();
    }
  }, [permissionsLoading]); // Run after permissions are loaded

  if (permissionsLoading) {
    return (
      <div className="w-full max-w-5xl mx-auto py-6 px-2 flex items-center justify-center" style={{height: 'calc(100vh - 48px)'}}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50" style={{maxHeight: 'calc(100vh - 48px)'}}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-blue-900">Dashboard Overview</h1>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || permissionsLoading}
        >
          <FiRefreshCw className={loading || permissionsLoading ? 'animate-spin' : ''} /> 
          {loading || permissionsLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      {error && <div className="text-center text-red-600 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PermissionWrapper permission="viewUsers">
          <div
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center border border-blue-50 hover:shadow-lg transition cursor-pointer hover:bg-blue-50"
            onClick={() => onTabChange && onTabChange('Team')}
            title="Go to Team Manage"
          >
            <BsMicrosoftTeams size={28} className="text-blue-500 mb-2" />
            <div className="text-3xl font-bold text-blue-800 mb-1">{stats.users}</div>
            <div className="text-gray-500 text-sm font-medium">Total Users</div>
          </div>
        </PermissionWrapper>
        
        <PermissionWrapper permission="viewThemes">
          <div
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center border border-green-50 hover:shadow-lg transition cursor-pointer hover:bg-green-50"
            onClick={() => onTabChange && onTabChange('Theme')}
            title="Go to Theme Manage"
          >
            <FiLayers size={28} className="text-green-500 mb-2" />
            <div className="text-3xl font-bold text-green-700 mb-1">{stats.themes}</div>
            <div className="text-gray-500 text-sm font-medium">Total Themes</div>
          </div>
        </PermissionWrapper>
        
        <PermissionWrapper permission="viewProblemStatements">
          <div
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center border border-yellow-50 hover:shadow-lg transition cursor-pointer hover:bg-yellow-50"
            onClick={() => onTabChange && onTabChange('Ps')}
            title="Go to PS Manage"
          >
            <FiFileText size={28} className="text-yellow-500 mb-2" />
            <div className="text-3xl font-bold text-yellow-700 mb-1">{stats.problems}</div>
            <div className="text-gray-500 text-sm font-medium">Total Problem Statements</div>
          </div>
        </PermissionWrapper>
        
        <PermissionWrapper permission="viewTeams">
          <div
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center border border-purple-50 hover:shadow-lg transition cursor-pointer hover:bg-purple-50"
            onClick={() => onTabChange && onTabChange('Team')}
            title="Go to Team Manage"
          >
            <BsMicrosoftTeams size={28} className="text-purple-500 mb-2" />
            <div className="text-3xl font-bold text-purple-700 mb-1">{stats.teams}</div>
            <div className="text-gray-500 text-sm font-medium">Total Teams</div>
          </div>
        </PermissionWrapper>
      </div>
    </div>
  );
};

export default OverviewTab;