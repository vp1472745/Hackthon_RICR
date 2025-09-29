import React, { useState, useEffect } from 'react';
import RightSidePanel from './RightSidePanel';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-toastify';
import TeamProfileCard from './TeamProfileCard';
import HackathonTimer from './HackathonTimer';
import { Users, Target, Award, RefreshCw, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

const Overview = () => {
  // Get data from sessionStorage
  const teamData = JSON.parse(sessionStorage.getItem('hackathonUser')) || {};
  const registrationData = JSON.parse(sessionStorage.getItem('registrationData')) || {};
  const selectedTheme = sessionStorage.getItem('selectedTheme') || null;

  // Leader profile state
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [apiTeamMembers, setApiTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    

  // Stats state
  const [teamStats, setTeamStats] = useState({
    totalMembers: 0,
    teamComplete: false,
    themeSelected: false,
    registrationComplete: false
  });

  // Fetch leader profile from API
  const fetchLeaderProfile = async () => {
    try {
      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setApiTeamMembers(userResponse.data.user.teamInfo?.members || []);
            updateTeamStats(userResponse.data.user, userResponse.data.user.teamInfo?.members || []);
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      }

      setError('Using offline data');
      const storedProfile = sessionStorage.getItem('leaderProfile');
      const storedMembers = sessionStorage.getItem('apiTeamMembers');
      
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setLeaderProfile(profile);
        if (storedMembers) {
          const members = JSON.parse(storedMembers);
          setApiTeamMembers(members);
          updateTeamStats(profile, members);
        }
      } else if (hackathonUser.user) {
        setLeaderProfile(hackathonUser.user);
        updateTeamStats(hackathonUser.user, []);
      }
    } finally {
      setLoading(false);
      
    }
  };




  // Update selectedTheme dynamically from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('selectedTheme');
    if (storedTheme) {
      setTeamStats((prevStats) => ({
        ...prevStats,
        themeSelected: true
      }));
    } else {
      setTeamStats((prevStats) => ({
        ...prevStats,
        themeSelected: false
      }));
    }
  }, []);

  // Fetch leader profile on component mount
  useEffect(() => {
    fetchLeaderProfile();
  }, []);

  const teamMembers = registrationData.teamMembers || [];

  // Reimplement updateTeamStats function
  const updateTeamStats = (profile, members) => {
    const totalMembers = members.length + 1; // Including the leader
    const teamComplete = totalMembers >= 4;
    const themeSelected = !!localStorage.getItem('selectedTheme');
    const registrationComplete = !!localStorage.getItem('registrationData');

    return {
        totalMembers,
        teamComplete,
        themeSelected,
        registrationComplete
    };
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      {/* Header Section */}
      

      {/* Error Banner */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-yellow-800">Offline Mode</p>
            <p className="text-sm text-yellow-700 mt-1">
              You're viewing cached data. Some information might not be up to date.
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            className="text-yellow-800 hover:text-yellow-900 text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Progress Bar Section */}
      <div className="mb-8">
        <HackathonTimer />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side - Team Profiles (2/3 width) */}
        <div className="xl:col-span-2">
          <TeamProfileCard
            leaderProfile={leaderProfile}
            teamData={teamData}
            apiTeamMembers={apiTeamMembers}
            teamMembers={teamMembers}
            loading={loading}
            error={error}
            fetchLeaderProfile={fetchLeaderProfile}
          />
        </div>

        {/* Right Side Panel (1/3 width) */}
        <div className="xl:col-span-1">
          <RightSidePanel
            selectedTheme={selectedTheme}
            teamStats={teamStats}
          />
        </div>
      </div>


    </div>
  );
};

export default Overview;