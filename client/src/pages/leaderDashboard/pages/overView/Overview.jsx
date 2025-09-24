import React, { useState, useEffect } from 'react';
import ProgressBar from '../progressBar';
import TeamLeaderCard from './TeamLeaderCard';
import TeamMembersCard from './TeamMembersCard';
import RightSidePanel from './RightSidePanel';
import { userAPI } from '../../../../configs/api';
import { toast } from 'react-toastify';

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

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Fetch leader profile from API
  const fetchLeaderProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First try authenticated API call
      const response = await userAPI.getLeaderProfile();
      
      if (response.data && response.data.leader) {
        setLeaderProfile(response.data.leader);
        setApiTeamMembers(response.data.teamMembers || []);
        
        // Store in localStorage for offline use
        localStorage.setItem('leaderProfile', JSON.stringify(response.data.leader));
        localStorage.setItem('apiTeamMembers', JSON.stringify(response.data.teamMembers || []));
        
        toast.success('Leader profile loaded successfully!');
      }
    } catch (error) {
      console.error('Error fetching leader profile:', error);
      
      // Try alternative approach - get user by ID from localStorage
      const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser') || '{}');
      if (hackathonUser.user && hackathonUser.user._id) {
        try {
          // Try to fetch user by ID as a fallback
          const userResponse = await userAPI.getUserById(hackathonUser.user._id);
          if (userResponse.data && userResponse.data.user) {
            setLeaderProfile(userResponse.data.user);
            setApiTeamMembers(userResponse.data.user.teamInfo?.members || []);
            
            toast.success('Profile loaded from user data!');
            return; // Exit early on success
          }
        } catch (fallbackError) {
          console.error('Fallback fetch failed:', fallbackError);
        }
      }
      
      // Final fallback to localStorage data
      setError('Using offline data');
      toast.warning('Using offline profile data');
      
      const storedProfile = localStorage.getItem('leaderProfile');
      const storedMembers = localStorage.getItem('apiTeamMembers');
      if (storedProfile) setLeaderProfile(JSON.parse(storedProfile));
      if (storedMembers) setApiTeamMembers(JSON.parse(storedMembers));
      
      // If no stored data, use hackathonUser data
      if (!storedProfile && hackathonUser.user) {
        setLeaderProfile(hackathonUser.user);
        toast.info('Using login session data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate countdown to hackathon
  useEffect(() => {
    const hackathonDate = new Date('2024-12-31T09:00:00'); // Set your hackathon date
    
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
    updateTimer(); // Initial call

    return () => clearInterval(timer);
  }, []);



  // Fetch leader profile on component mount
  useEffect(() => {
    fetchLeaderProfile();
  }, []);

  const teamMembers = registrationData.teamMembers || [];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
              Welcome back, {teamData.name || 'Team Leader'}!
            </h1>
            <p className="text-gray-600">
              Track your hackathon progress and manage your team from here.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">FutureMaze Hackathon 2025</div>
            <div className="font-semibold text-[#0B2A4A]">Team Dashboard</div>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <ProgressBar />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Team Profiles */}
        <div className="space-y-6">
          {/* Team Leader Profile */}
          <TeamLeaderCard 
            leaderProfile={leaderProfile}
            teamData={teamData}
            loading={loading}
            error={error}
            fetchLeaderProfile={fetchLeaderProfile}
          />

          {/* Team Members */}
          <TeamMembersCard 
            apiTeamMembers={apiTeamMembers}
            teamMembers={teamMembers}
          />
        </div>

        {/* Right Side - Timer and Theme Info */}
        <RightSidePanel 
          timeLeft={timeLeft}
          selectedTheme={selectedTheme}
        />
      </div>

    </div>
  );
};

export default Overview;