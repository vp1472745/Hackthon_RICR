import React from 'react';
import { Users, UserCheck, UserPlus, Crown } from 'lucide-react';

const TeamStats = ({ teamMembers }) => {
  const maxMembers = 3; // Max 4 team members (excluding leader)
  const leader = teamMembers.find(m => m.role === 'Leader');
  const members = teamMembers.filter(m => m.role === 'Member');
  const currentMembers = Array.isArray(teamMembers) ? teamMembers.filter(m => m.role === 'Member').length : 0;
  const slotsAvailable = maxMembers - currentMembers;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
      {/* Team Leader Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Crown className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-blue-600 text-sm font-medium">Leader</div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{leader ? 1 : 1}</div>
        <div className="text-sm text-gray-600">Team Leader</div>
      </div>

      {/* Members Added Card */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <UserCheck className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-green-600 text-sm font-medium">Added</div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{currentMembers}/{maxMembers}</div>
        <div className="text-sm text-gray-600">Members Added</div>
      </div>

      {/* Slots Available Card */}
      <div className="  bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <UserPlus className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-purple-600 text-sm font-medium">Available</div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{Math.max(0, slotsAvailable)}</div>
        <div className="text-sm text-gray-600">Slots Available</div>
      </div>
    </div>
  );
};

export default TeamStats;