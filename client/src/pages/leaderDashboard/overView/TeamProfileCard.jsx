import React, { useEffect, useState } from 'react';
import { User, Users, Mail, Phone, Trophy, Timer, Play } from 'lucide-react';

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

  // Combine leader and members, filter out duplicate leader if present
  const leader = leaderProfile || teamData?.user || teamData;
  const members = (apiTeamMembers.length > 0 ? apiTeamMembers : teamMembers)
    .filter(m => m.role !== 'Leader');

  return (
    <>
      {/* Hackathon Countdown Section */}

      <div className="bg-white mt-5 rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Team Profile Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between sm:mb-6">
          <div
            className="flex items-center gap-3 cursor-pointer mb-4 sm:mb-0"
            onClick={() => setActiveSection && setActiveSection('team')}
            title="Go to Manage Team"
          >
            <Users className="w-6 h-6 sm:w-7 sm:h-7 text-[#0B2A4A]" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 text-center sm:text-left">Team Profile</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <button
              className="bg-blue-500 text-white py-2 px-4 sm:py-2 sm:px-6 rounded-lg hover:bg-blue-600 transition-all w-full sm:w-auto text-sm sm:text-base"
              onClick={() => {
                const event = new CustomEvent('changeSection', { detail: 'team' });
                window.dispatchEvent(event);
              }}
            >
              Manage Team
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-[#0B2A4A]"></div>
            <span className="mt-2 sm:mt-3 text-gray-600 text-sm sm:text-base">Loading profile...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-red-500 mb-2 sm:mb-3 text-sm sm:text-base">{error}</div>
            <button
              onClick={fetchLeaderProfile}
              className="text-[#0B2A4A] hover:underline text-sm sm:text-base"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8">
            {/* Leader Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl sm:text-2xl">
                  {(leader?.fullName || leader?.name || 'T').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl mb-2 sm:mb-3 flex flex-col sm:flex-row items-center gap-2">
                  <span className="break-all sm:break-normal">{leader?.fullName || leader?.name || 'Not Set'}</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0B2A4A] text-white mt-1 sm:mt-0">
                    <Trophy className="w-3 h-3 mr-1" />
                    Team Leader
                  </span>
                </h3>
                <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 break-all">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <span className="break-all">{leader?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600 break-all">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="break-all">{leader?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div>
              <h4 className="text-md sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 text-center sm:text-left">Team Members</h4>
              <div className="space-y-3 sm:space-y-4">
                {members.length > 0 ? (
                  members.map((member, idx) => (
                    <div key={member._id || idx} className="flex flex-col sm:flex-row items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {(member.fullName || member.name || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-center sm:text-left w-full sm:w-auto">
                        <h4 className="font-medium text-gray-900 text-base sm:text-lg mb-1 break-all">
                          {member.fullName || member.name || `Member ${idx + 1}`}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {member.email && (
                            <div className="flex items-center justify-center sm:justify-start gap-1 break-all">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="break-all">{member.email}</span>
                            </div>
                          )}
                          {member.role && (
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full mt-1 sm:mt-2">
                              {member.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <Users className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 opacity-50" />
                    <p className="text-sm sm:text-base">No team members added yet</p>
                    <p className="text-xs sm:text-sm mt-1">Add team members to complete your team</p>
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