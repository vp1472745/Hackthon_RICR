import React, { useState, useEffect } from 'react';
import RightSidePanel from './RightSidePanel';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-toastify';
import TeamProfileCard from './TeamProfileCard';
import HackathonTimer from './HackathonTimer';
import { Users, Target, Award, RefreshCw, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

const Overview = () => {
  // Get data from localStorage
  const teamData = JSON.parse(localStorage.getItem('hackathonUser')) || {};
  const registrationData = JSON.parse(localStorage.getItem('registrationData')) || {};
  const selectedTheme = localStorage.getItem('selectedTheme') || null;

  // Leader profile state
  const [leaderProfile, setLeaderProfile] = useState(null);
  const [apiTeamMembers, setApiTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
      setLoading(true);
      setError(null);


      const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setApiTeamMembers(userResponse.data.user.teamInfo?.members || []);
            updateTeamStats(userResponse.data.user, userResponse.data.user.teamInfo?.members || []);
            toast.success('Profile loaded successfully!');
            return;
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      }

      setError('Using offline data');
      const storedProfile = localStorage.getItem('leaderProfile');
      const storedMembers = localStorage.getItem('apiTeamMembers');
      
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
      setRefreshing(false);
    }
  };

  // Update team statistics
  const updateTeamStats = (profile, members) => {
    const totalMembers = members.length + 1;
    const teamComplete = totalMembers >= 4;
    const themeSelected = !!selectedTheme;
    const registrationComplete = !!(registrationData && Object.keys(registrationData).length > 0);

    setTeamStats({
      totalMembers,
      teamComplete,
      themeSelected,
      registrationComplete
    });
  };

  // Handle manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLeaderProfile();
    toast.info('Data refreshed successfully!');
  };

  // Calculate countdown to hackathon
  useEffect(() => {
    const hackathonDate = new Date('2024-12-31T09:00:00');

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = hackathonDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(updateTimer, 1000);
    updateTimer();

    return () => clearInterval(timer);
  }, []);

  // Update stats when dependencies change
  useEffect(() => {
    if (leaderProfile) {
      updateTeamStats(leaderProfile, apiTeamMembers);
    }
  }, [leaderProfile, apiTeamMembers, selectedTheme, registrationData]);

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
            timeLeft={timeLeft}
            selectedTheme={selectedTheme}
            teamStats={teamStats}
          />
        </div>
      </div>


    </div>
  );
};

export default Overview;