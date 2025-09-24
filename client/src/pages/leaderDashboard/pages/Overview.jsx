import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Target, 
  Calendar, 
  Trophy,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Timer,
  Play,
  FileText
} from 'lucide-react';
import ProgressBar from './progressBar';

const Overview = () => {
  // Get data from localStorage
  const teamData = JSON.parse(localStorage.getItem('hackathonUser')) || {};
  const registrationData = JSON.parse(localStorage.getItem('registrationData')) || {};
  const selectedTheme = localStorage.getItem('selectedTheme') || null;

  // Timer state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-[#0B2A4A]" />
              <h2 className="text-lg font-semibold text-gray-800">Team Leader</h2>
            </div>
            
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  {teamData.name ? teamData.name.charAt(0).toUpperCase() : 'T'}
                </span>
              </div>
              
              {/* Profile Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">
                  {teamData.name || 'Not Set'}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{teamData.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{teamData.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{teamData.college || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{teamData.course || 'Not provided'}</span>
                  </div>
                </div>
                
                {/* Leader Badge */}
                <div className="mt-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0B2A4A] text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    Team Leader
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-[#0B2A4A]" />
                <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
              </div>
              <span className="text-sm text-gray-500">
                {teamMembers.length}/3 Added
              </span>
            </div>

            <div className="space-y-4">
              {teamMembers.length > 0 ? (
                teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    {/* Member Avatar */}
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {member.name ? member.name.charAt(0).toUpperCase() : 'M'}
                      </span>
                    </div>
                    
                    {/* Member Details */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{member.name || `Member ${index + 1}`}</h4>
                      <div className="text-sm text-gray-600">
                        {member.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <span>{member.email}</span>
                          </div>
                        )}
                        {member.college && (
                          <div className="flex items-center gap-1 mt-1">
                            <GraduationCap className="w-3 h-3" />
                            <span>{member.college}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No team members added yet</p>
                  <p className="text-xs mt-1">Add team members to complete your team</p>
                </div>
              )}

              {/* Placeholder slots for remaining members */}
              {Array.from({ length: Math.max(0, 3 - teamMembers.length) }).map((_, index) => (
                <div key={`empty-${index}`} className="flex items-center gap-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-500 text-sm">Member Slot {teamMembers.length + index + 1}</p>
                    <p className="text-xs text-gray-400">Waiting to be filled</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Timer and Theme Info */}
        <div className="space-y-6">
          {/* Countdown Timer */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Timer className="w-6 h-6 text-[#0B2A4A]" />
              <h2 className="text-lg font-semibold text-gray-800">Hackathon Countdown</h2>
            </div>

            {/* Timer Display */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
                <div className="text-2xl font-bold">{timeLeft.days}</div>
                <div className="text-xs opacity-80">Days</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
                <div className="text-2xl font-bold">{timeLeft.hours}</div>
                <div className="text-xs opacity-80">Hours</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
                <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                <div className="text-xs opacity-80">Minutes</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
                <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                <div className="text-xs opacity-80">Seconds</div>
              </div>
            </div>

            {/* Start Button (Disabled) */}
            <button 
              disabled
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
            >
              <Play className="w-5 h-5" />
              Start Hackathon (Coming Soon)
            </button>
            
            <p className="text-center text-xs text-gray-500 mt-2">
              Button will be enabled when hackathon begins
            </p>
          </div>

          {/* Selected Theme */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-[#0B2A4A]" />
              <h2 className="text-lg font-semibold text-gray-800">Selected Theme</h2>
            </div>

            {selectedTheme ? (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Theme Selected</span>
                </div>
                <h3 className="font-semibold text-lg text-[#0B2A4A] mb-2">{selectedTheme}</h3>
                <p className="text-sm text-gray-600">
                  Great choice! You've successfully selected your hackathon theme. 
                  Make sure to review the problem statement and requirements.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-gray-900">No Theme Selected</span>
                </div>
                <p className="text-sm text-gray-600">
                  Please select a theme from the Project Theme section to continue with your hackathon preparation.
                </p>
              </div>
            )}
          </div>

          {/* Problem Statement */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-[#0B2A4A]" />
              <h2 className="text-lg font-semibold text-gray-800">Problem Statement</h2>
            </div>

            {selectedTheme ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Challenge Overview</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Your selected theme: <span className="font-semibold text-[#0B2A4A]">{selectedTheme}</span>
                  </p>
                  <div className="text-sm text-gray-600">
                    <p className="mb-2">Key Requirements:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Innovative solution addressing real-world problems</li>
                      <li>Technical implementation with proper documentation</li>
                      <li>Working prototype or MVP</li>
                      <li>Clear presentation and demonstration</li>
                    </ul>
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800 font-medium">
                    💡 Tip: Review the detailed problem statement in the Project Theme section for complete guidelines.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">Select a theme to view problem statement</p>
                <p className="text-xs mt-1">The problem statement will appear once you choose your theme</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Overview;