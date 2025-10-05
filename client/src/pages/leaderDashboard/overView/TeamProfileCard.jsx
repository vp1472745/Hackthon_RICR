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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 xs:p-4 sm:p-6 md:p-8 lg:p-10 space-y-4 xs:space-y-6">
        {/* Team Profile Section */}
        <div className="flex flex-col xs:flex-row items-center justify-between mb-3 xs:mb-4 sm:mb-6 gap-3 xs:gap-4">
          <div
            className="flex items-center gap-2 xs:gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setActiveSection && setActiveSection('team')}
            title="Go to Manage Team"
          >
            <Users className="w-5 h-5 xs:w-6 xs:h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-[#0B2A4A]" />
            <h2 className="text-base xs:text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 text-center xs:text-left">Team Profile</h2>
          </div>
          <div className="flex flex-col xs:flex-row items-center gap-2 w-full xs:w-auto">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 xs:py-2.5 sm:py-3 px-3 xs:px-4 sm:px-6 md:px-8 rounded-lg transition-all duration-200 w-full xs:w-auto text-xs xs:text-sm sm:text-base md:text-lg font-medium shadow-sm hover:shadow-md transform hover:scale-105"
              onClick={() => {
                const event = new CustomEvent('changeSection', { detail: 'team' });
                window.dispatchEvent(event);
              }}
            >
              <span className="hidden xs:inline">Manage Team</span>
              <span className="xs:hidden">Manage</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-6 xs:py-8 sm:py-12 md:py-16">
            <div className="animate-spin rounded-full h-6 w-6 xs:h-8 xs:w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-[#0B2A4A]"></div>
            <span className="mt-2 xs:mt-3 sm:mt-4 text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg">Loading profile...</span>
          </div>
        ) : error ? (
          <div className="text-center py-6 xs:py-8 sm:py-12 md:py-16">
            <div className="text-red-500 mb-2 xs:mb-3 sm:mb-4 text-xs xs:text-sm sm:text-base md:text-lg">{error}</div>
            <button
              onClick={fetchLeaderProfile}
              className="text-[#0B2A4A] hover:underline text-xs xs:text-sm sm:text-base md:text-lg transition-colors"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="space-y-4 xs:space-y-6 sm:space-y-8 md:space-y-10">
            {/* Leader Section */}
            <div className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 sm:gap-6 md:gap-8 mb-4 xs:mb-6 sm:mb-8">
              <div className="w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                <span className="text-white font-bold text-lg xs:text-xl sm:text-2xl md:text-3xl">
                  {(leader?.fullName || leader?.name || 'T').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-center xs:text-left w-full xs:w-auto">
                <h3 className="font-semibold text-gray-900 text-base xs:text-lg sm:text-xl md:text-2xl mb-2 xs:mb-3 sm:mb-4 flex flex-col xs:flex-row items-center gap-2 xs:gap-3">
                  <span className="break-all xs:break-normal">{leader?.fullName || leader?.name || 'Not Set'}</span>
                  <span className="inline-flex items-center px-2 xs:px-3 py-1 xs:py-1.5 rounded-full text-xs xs:text-sm font-medium bg-[#0B2A4A] text-white mt-1 xs:mt-0 shadow-sm">
                    <Trophy className="w-2 h-2 xs:w-3 xs:h-3 mr-1" />
                    <span className="hidden xs:inline">Team Leader</span>
                    <span className="xs:hidden">Leader</span>
                  </span>
                </h3>
                <div className="space-y-1 xs:space-y-2 sm:space-y-3 text-xs xs:text-sm sm:text-base md:text-lg">
                  <div className="flex items-center justify-center xs:justify-start gap-2 xs:gap-3 text-gray-600 break-all">
                    <Mail className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-all truncate max-w-full">{leader?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center justify-center xs:justify-start gap-2 xs:gap-3 text-gray-600 break-all">
                    <Phone className="w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                    <span className="break-all">{leader?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div>
              <h4 className="text-sm xs:text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-2 xs:mb-3 sm:mb-4 md:mb-6 text-center xs:text-left">Team Members</h4>
              <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                {members.length > 0 ? (
                  members.map((member, idx) => (
                    <div key={member._id || idx} className="flex flex-col xs:flex-row items-center gap-3 xs:gap-4 sm:gap-6 p-2 xs:p-3 sm:p-4 md:p-6 bg-gray-50 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors duration-200 shadow-sm hover:shadow-md">
                      <div className="w-10 h-10 xs:w-12 xs:h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-white font-semibold text-xs xs:text-sm sm:text-base md:text-lg">
                          {(member.fullName || member.name || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-center xs:text-left w-full xs:w-auto">
                        <h4 className="font-medium text-gray-900 text-sm xs:text-base sm:text-lg md:text-xl mb-1 xs:mb-2 break-all">
                          {member.fullName || member.name || `Member ${idx + 1}`}
                        </h4>
                        <div className="text-xs xs:text-sm sm:text-base text-gray-600 space-y-1 xs:space-y-2">
                          {member.email && (
                            <div className="flex items-center justify-center xs:justify-start gap-1 xs:gap-2 break-all">
                              <Mail className="w-2 h-2 xs:w-3 xs:h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="break-all truncate max-w-full">{member.email}</span>
                            </div>
                          )}
                          {member.role && (
                            <span className="inline-block px-2 xs:px-3 py-1 bg-blue-100 text-blue-800 text-xs xs:text-sm rounded-full mt-1 xs:mt-2 shadow-sm">
                              {member.role}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 xs:py-6 sm:py-8 md:py-12 text-gray-500">
                    <Users className="w-6 h-6 xs:w-8 xs:h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 mx-auto mb-2 xs:mb-3 sm:mb-4 opacity-50" />
                    <p className="text-xs xs:text-sm sm:text-base md:text-lg font-medium">No team members added yet</p>
                    <p className="text-xs xs:text-sm sm:text-base mt-1 xs:mt-2 opacity-75">Add team members to complete your team</p>
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