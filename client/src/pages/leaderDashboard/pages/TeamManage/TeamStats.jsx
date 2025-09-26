import React from 'react';

const TeamStats = ({ teamMembers }) => {
  const currentMembers = teamMembers.length;
  const maxMembers = 4; // Max 4 team members (excluding leader)
  const confirmedMembers = teamMembers.filter(m => m.status === 'confirmed').length;
  const slotsAvailable = maxMembers - currentMembers; // Remaining member slots

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="text-2xl font-bold text-blue-800">{currentMembers}</div>
        <div className="text-sm text-blue-600">Team Members</div>
      </div>
      <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
        <div className="text-2xl font-bold text-indigo-800">{currentMembers}/{maxMembers}</div>
        <div className="text-sm text-indigo-600">Members Added</div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="text-2xl font-bold text-green-800">{confirmedMembers || currentMembers}</div>
        <div className="text-sm text-green-600">Active Members</div>
      </div>
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <div className="text-2xl font-bold text-purple-800">{Math.max(0, slotsAvailable)}</div>
        <div className="text-sm text-purple-600">Slots Available</div>
      </div>
    </div>
  );
};

export default TeamStats;