import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../configs/api';

const ViewTeams = () => {
  const [teams, setTeams] = useState([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [teamsError, setTeamsError] = useState('');

  useEffect(() => {
    setTeamsLoading(true);
    setTeamsError('');
    AdminAPI.getAllTeams()
      .then(res => setTeams(res.data.teams || []))
      .catch(() => setTeamsError('Failed to fetch teams'))
      .finally(() => setTeamsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">All Teams</h2>
      {teamsLoading ? (
        <div className="text-gray-500">Loading teams...</div>
      ) : teamsError ? (
        <div className="text-red-500">{teamsError}</div>
      ) : teams.length === 0 ? (
        <div className="text-gray-500">No teams found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Team Name</th>
                <th className="border px-2 py-1">Leader</th>
                <th className="border px-2 py-1">Members</th>
                <th className="border px-2 py-1">Theme</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team._id}>
                  <td className="border px-2 py-1 font-semibold">{team.teamName}</td>
                  <td className="border px-2 py-1">{team.leaderName || '-'}</td>
                  <td className="border px-2 py-1">{team.members?.length || 0}</td>
                  <td className="border px-2 py-1">{team.themeName || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ViewTeams;
