import React, { useEffect, useState } from 'react';
import { 
  Target, 
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { teamAPI, problemStatementAPI } from '../../../../configs/api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const RightSidePanel = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [problem, setProblem] = useState(null);
  const [loadingProblem, setLoadingProblem] = useState(false);
  const [error, setError] = useState('');

 
  const fetchThemeName = async (themeId) => {
    try {
      const res = await teamAPI.getThemeName(themeId); // Assuming this API exists
      setSelectedTheme(res.data.themeName || 'Unknown Theme');
    } catch (err) {
      console.error('Error fetching theme name:', err);
      setSelectedTheme('Unknown Theme');
    }
  };

  const fetchProblemStatement = async (teamId) => {
    setLoadingProblem(true);
    setError('');
    try {
      const res = await problemStatementAPI.getByTeam(teamId);
      let problemData = null;

      // Check multiple response formats
      if (res.data.problemStatements && res.data.problemStatements.length > 0) {
        problemData = res.data.problemStatements[0];
      } else if (res.data.problems && res.data.problems.length > 0) {
        problemData = res.data.problems[0];
      } else if (res.data.problemStatement) {
        problemData = res.data.problemStatement;
      } else if (res.data.problem) {
        problemData = res.data.problem;
      }

      setProblem(problemData);
    } catch (err) {
      console.error('Error fetching problem statement:', err);
      setError('Failed to load problem statement');
    }
    setLoadingProblem(false);
  };

  return (
    <div className="space-y-6">

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

        {loadingProblem ? (
          <div className="text-center text-gray-600">Loading problem statement...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : selectedTheme && problem ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{problem.PStitle}</h3>
              <p className="text-sm text-gray-600">{problem.PSdescription}</p>
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
  );
};

export default RightSidePanel;
