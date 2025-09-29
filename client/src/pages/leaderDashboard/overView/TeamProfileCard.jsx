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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6">
        {/* Team Profile Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveSection && setActiveSection('team')}
            title="Go to Manage Team"
          >
            <Users className="w-6 h-6 text-[#0B2A4A]" />
            <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">Team Profile</h2>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 sm:mt-0">
            <button
              onClick={fetchLeaderProfile}
              disabled={loading}
              className="p-2 text-gray-500 hover:text-[#0B2A4A] transition-colors disabled:opacity-50"
              title="Refresh profile"
            >
              Refresh
            </button>
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
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
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0B2A4A]"></div>
            <span className="mt-2 text-gray-600">Loading profile...</span>
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
          <div className="space-y-6">
            {/* Leader Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-xl">
                  {(leader?.fullName || leader?.name || 'T').charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 text-lg mb-1 flex items-center justify-center sm:justify-start gap-2">
                  {leader?.fullName || leader?.name || 'Not Set'}
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#0B2A4A] text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    Team Leader
                  </span>
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{leader?.email || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{leader?.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-2 text-center sm:text-left">Team Members</h4>
              <div className="space-y-3">
                {members.length > 0 ? (
                  members.map((member, idx) => (
                    <div key={member._id || idx} className="flex flex-col sm:flex-row items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">
                          {(member.fullName || member.name || 'M').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h4 className="font-medium text-gray-900">
                          {member.fullName || member.name || `Member ${idx + 1}`}
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {member.email && (
                            <div className="flex items-center justify-center sm:justify-start gap-1">
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