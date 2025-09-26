import React, { useEffect, useState } from 'react';
import { User, Users, Mail, Phone, Trophy, Timer, Play } from 'lucide-react';

const HACKATHON_START = new Date('2025-11-06T12:00:00+05:30'); // 6 Nov 12pm IST

function getIndiaTime() {
  // Get current time in IST
  const now = new Date();
  // Convert to IST (UTC+5:30)
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (5.5 * 60 * 60 * 1000));
}

const TeamProfileCard = ({
  leaderProfile,
  teamData,
  apiTeamMembers = [],
  teamMembers = [],
  loading,
  error,
  fetchLeaderProfile,
  setActiveSection
}) => {
  // Hackathon countdown state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const updateTimer = () => {
      const now = getIndiaTime();
      const distance = HACKATHON_START.getTime() - now.getTime();
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

  // Combine leader and members, filter out duplicate leader if present
  const leader = leaderProfile || teamData?.user || teamData;
  const members = (apiTeamMembers.length > 0 ? apiTeamMembers : teamMembers)
    .filter(m => m.role !== 'Leader');
  

  return (
    <>
      {/* Hackathon Countdown Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Timer className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800">Hackathon Countdown</h2>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
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
        <div className="text-center text-sm text-gray-700 mb-2">
          Hackathon starts on <span className="font-semibold text-[#0B2A4A]">6 November 12:00 PM IST</span>
        </div>
        <div className="text-center text-xs text-gray-500">
          Time left until hackathon begins
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Team Profile Section */}
        <div className="flex items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveSection && setActiveSection('team')}
            title="Go to Manage Team"
          >
            <Users className="w-6 h-6 text-[#0B2A4A]" />
            <h2 className="text-lg font-semibold text-gray-800">Team Profile</h2>
          </div>
          <button
            onClick={fetchLeaderProfile}
            disabled={loading}
            className="p-2 text-gray-500 hover:text-[#0B2A4A] transition-colors disabled:opacity-50"
            title="Refresh profile"
          >
            <User className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B2A4A]"></div>
            <span className="ml-2 text-gray-600">Loading profile...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">{error}</div>
            <button
              onClick={fetchLeaderProfile}
              className="text-[#0B2A4A] hover:underline"
            >
              Try again
            </button>
          </div>
        ) : (
          <div>
            {/* Leader Section */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  {(leader?.fullName || leader?.name || 'T').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg justify-between mb-1 flex items-center gap-2">
                  {leader?.fullName || leader?.name || 'Not Set'}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0B2A4A] text-white ml-2">
                    <Trophy className="w-3 h-3 mr-1" />
                    Team Leader
                  </span>
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{leader?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{leader?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Members Section */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-2">Team Members</h4>
              <div className="space-y-3">
                {members.length > 0 ? (
                  members.map((member, idx) => (
                    <div key={member._id || idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {(member.fullName || member.name || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          {member.fullName || member.name || `Member ${idx + 1}`}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {member.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              <span>{member.email}</span>
                            </div>
                          )}
                          {member.role && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1">
                              {member.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No team members added yet</p>
                    <p className="text-xs mt-1">Add team members to complete your team</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TeamProfileCard;