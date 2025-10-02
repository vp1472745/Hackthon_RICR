import React, { useEffect, useState } from 'react';
import { AdminAPI, problemStatementAPI } from '../../configs/api';

const ProblemStatementsAdmin = () => {
  const [problems, setProblems] = useState([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [problemsError, setProblemsError] = useState('');
  const [problemForm, setProblemForm] = useState({ PStitle: '', PSdescription: '' });
  const [problemMsg, setProblemMsg] = useState('');
  const [problemFormLoading, setProblemFormLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [permissions, setPermissions] = useState([]);
  const [adminEmail, setAdminEmail] = useState('');


  // Fetch admin email and permissions
  useEffect(() => {
    // Clear any localStorage data that might be interfering
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("permissions");
    localStorage.removeItem("adminUser");
    
    const adminUser = sessionStorage.getItem('adminUser');
    if (adminUser) {
      const parsed = JSON.parse(adminUser);
      setAdminEmail(parsed.email);
    }
  }, []);

  useEffect(() => {
    if (adminEmail) {
      AdminAPI.getAdminPermissions(adminEmail)
        .then(res => setPermissions(res.data.permissions || []))
        .catch(() => setPermissions([]));
    }
  }, [adminEmail]);

  // Fetch all teams for dropdown
  useEffect(() => {
    AdminAPI.getAllTeams()
      .then(res => setTeams(res.data.teams || []))
      .catch(() => setTeams([]));
  }, []);

  // Fetch problem statements for selected team
  useEffect(() => {
    if (!selectedTeamId) return;
    setProblemsLoading(true);
    setProblemsError('');
    problemStatementAPI.getByTeam(selectedTeamId)
      .then(res => setProblems(res.data.problemStatements || []))
      .catch(() => setProblemsError('Failed to fetch problem statements'))
      .finally(() => setProblemsLoading(false));
  }, [selectedTeamId, problemMsg]);

  const handleProblemInput = (e) => {
    setProblemForm({ ...problemForm, [e.target.name]: e.target.value });
  };

  const handleProblemSubmit = async (e) => {
    e.preventDefault();
    setProblemFormLoading(true);
    setProblemMsg('');
    try {
      await AdminAPI.createProblemStatement(problemForm);
      setProblemMsg('Problem statement created successfully!');
      setProblemForm({ PStitle: '', PSdescription: '' });
    } catch (err) {
      setProblemMsg('Failed to create problem statement');
    } finally {
      setProblemFormLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-4 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Manage Problem Statements</h2>
      {/* Team selection dropdown */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Select Team</label>
        <select
          className="w-full border px-3 py-2 rounded"
          value={selectedTeamId}
          onChange={e => setSelectedTeamId(e.target.value)}
        >
          <option value="">-- Select a team --</option>
          {teams.map(team => (
            <option key={team._id} value={team._id}>{team.teamName}</option>
          ))}
        </select>
      </div>

      {/* Only show create form if admin has createProblemStatement permission */}
      {permissions.includes('createProblemStatement') && selectedTeamId && (
        <form onSubmit={handleProblemSubmit} className="space-y-4 bg-gray-50 p-4 rounded shadow">
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              name="PStitle"
              value={problemForm.PStitle}
              onChange={handleProblemInput}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              name="PSdescription"
              value={problemForm.PSdescription}
              onChange={handleProblemInput}
              className="w-full border px-3 py-2 rounded"
              rows={3}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 text-white px-6 py-2 rounded font-semibold"
            disabled={problemFormLoading}
          >
            {problemFormLoading ? 'Creating...' : 'Create Problem Statement'}
          </button>
          {problemMsg && <div className={problemMsg.includes('success') ? 'text-green-600' : 'text-red-600'}>{problemMsg}</div>}
        </form>
      )}

      <h3 className="text-lg font-semibold mt-8 mb-2">All Problem Statements</h3>
      {problemsLoading ? (
        <div className="text-gray-500">Loading problem statements...</div>
      ) : problemsError ? (
        <div className="text-red-500">{problemsError}</div>
      ) : problems.length === 0 ? (
        <div className="text-gray-500">No problem statements found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Title</th>
                <th className="border px-2 py-1">Description</th>
                <th className="border px-2 py-1">Edit</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem) => (
                <tr key={problem._id}>
                  <td className="border px-2 py-1 font-semibold">{problem.PStitle}</td>
                  <td className="border px-2 py-1">{problem.PSdescription}</td>
                  <td className="border px-2 py-1">
                    {/* TODO: Add edit functionality */}
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProblemStatementsAdmin;
