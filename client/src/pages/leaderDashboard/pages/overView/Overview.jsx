import React, { useState, useEffect } from 'react';
import RightSidePanel from './RightSidePanel';
import { userAPI } from '../../../../configs/api';
import { toast } from 'react-toastify';
import TeamProfileCard from './TeamProfileCard';
import HackathonTimer from './HackathonTimer';


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
        const { leader, team } = response.data;
        setLeaderProfile(leader);
        setApiTeamMembers(team?.members || []);

        // Store in localStorage for offline use
        localStorage.setItem('leaderProfile', JSON.stringify(leader));
        localStorage.setItem('apiTeamMembers', JSON.stringify(team?.members || []));
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


      {/* Progress Bar Section */}
      <HackathonTimer />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Team Profiles */}
        <div className="space-y-6">
          {/* Team Leader Profile */}
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