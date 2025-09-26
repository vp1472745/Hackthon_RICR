import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import { problemStatementAPI } from '../../../configs/api.js';

const ProblemStatements = () => {
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Get teamId from user info or cookie
  const hackathonUser = JSON.parse(localStorage.getItem('hackathonUser'));
  const teamId = hackathonUser?.team?._id || hackathonUser?.teamId || hackathonUser?.user?.teamId;

  useEffect(() => {
    const fetchProblem = async () => {
      console.log('teamId:', teamId);
      if (!teamId) {
        setProblem(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Try main endpoint
        const res = await problemStatementAPI.getByTeam(teamId);
        console.log('API response:', res.data);
        let problem = null;
        if (res.data.problemStatements && Array.isArray(res.data.problemStatements) && res.data.problemStatements.length > 0) {
          problem = res.data.problemStatements[0];
        } else if (res.data.problems && Array.isArray(res.data.problems) && res.data.problems.length > 0) {
          problem = res.data.problems[0];
        } else if (res.data.problemStatement) {
          problem = res.data.problemStatement;
        } else if (res.data.problem) {
          problem = res.data.problem;
        }
        setProblem(problem);
        setLoading(false);
      } catch (err) {
        setError('Failed to load problem statement');
        setLoading(false);
        console.error('Fetch error:', err);
      }
    };
    fetchProblem();
  }, [teamId]);

  const handleDownloadPDF = () => {
    if (!problem) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Title: ${problem.PStitle}`, 10, 20);
    doc.setFontSize(12);
    doc.text('Description:', 10, 35);
    doc.setFontSize(11);
    const lines = doc.splitTextToSize(problem.PSdescription || '', 180);
    doc.text(lines, 10, 45);
    doc.save(`${problem.PStitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'problem_statement'}.pdf`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Problem Statement</h1>
        {loading && <div className="text-center text-gray-600">Loading problem statement...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        {!loading && !error && !problem && (
          <div className="text-gray-500">No problem statement found for your selected theme.</div>
        )}
        {!loading && !error && problem && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#0B2A4A] mb-2">{problem.PStitle}</h2>
              <p className="text-gray-700 mb-4">{problem.PSdescription}</p>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemStatements;
