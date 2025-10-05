import React, { useEffect, useState } from 'react';
import { Target, FileText, Loader } from 'lucide-react';
import { problemStatementAPI } from '../../../configs/api';

const RightSidePanel = () => {
  const [selectedTheme, setSelectedTheme] = useState('Loading...');
  const [selectedProblemStatement, setSelectedProblemStatement] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser'));
      
      // Fetch theme data
      const themeFromSession = hackathonUser?.theme?.themeName || sessionStorage.getItem('selectedTheme');
      const themeFromTeam = hackathonUser?.team?.teamTheme?.themeName;
      const theme = themeFromSession || themeFromTeam || 'No theme selected';
      setSelectedTheme(theme);

      const teamId = hackathonUser?.team?._id || hackathonUser?.teamId;
      
      if (teamId) {
        try {

          
          // Try multiple API methods to get selected problem statement
          let selectedProblem = null;
          
          // Method 1: Check if team has already selected a problem (from team data)
          const teamProblemId = hackathonUser?.team?.selectedProblemStatement || hackathonUser?.team?.teamProblemStatement;
          
    
          
          // Method 2: Get available problems and check selection
          try {
            const availableRes = await problemStatementAPI.getActiveForTeam(teamId);
         
            
            if (availableRes.data.success && availableRes.data.problemStatements) {
              // Check if any problem is already selected by this team
              selectedProblem = availableRes.data.problemStatements.find(p => 
                p._id === teamProblemId
              );
              
             
            }
          } catch (availableErr) {
            console.error('Could not fetch available problems:', availableErr);
          }
          
          // Method 3: Fallback to legacy API
          if (!selectedProblem) {
            try {
              const legacyRes = await problemStatementAPI.getByTeam(teamId);
              let problem = null;
              
              if (legacyRes.data.problemStatements && Array.isArray(legacyRes.data.problemStatements) && legacyRes.data.problemStatements.length > 0) {
                problem = legacyRes.data.problemStatements[0];
              } else if (legacyRes.data.problemStatement) {
                problem = legacyRes.data.problemStatement;
              }
              
              selectedProblem = problem;
            } catch (legacyErr) {
              console.error('Legacy API also failed:', legacyErr);
            }
          }
          
          // Update state
          if (selectedProblem) {
            setSelectedProblemStatement(selectedProblem.PStitle || selectedProblem.title || 'Problem statement selected');
          } else {
            setSelectedProblemStatement('No problem statement selected');
          }
          
        } catch (err) {
          setSelectedProblemStatement('Error loading problem statement');
        }
      } else {
        setSelectedProblemStatement('Team not found');
      }
      
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6 p-4 sm:p-6 bg-gray-50 min-h-screen">
      {/* Selected Theme Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">Selected Theme</h2>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          {loading && selectedTheme === 'Loading...' ? (
            <div className="flex items-center gap-2 justify-center">
              <Loader className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Loading theme...</span>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left">{selectedTheme}</h3>
              <p className="text-sm text-gray-600 text-center sm:text-left">This is your selected theme for the hackathon.</p>
            </>
          )}
        </div>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
          onClick={() => {
            const event = new CustomEvent('changeSection', { detail: 'projectTheme' });
            window.dispatchEvent(event);
          }}
        >
          Change Theme
        </button>
      </div>

      {/* Selected Problem Statement Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800 text-center sm:text-left">Selected Problem Statement</h2>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          {loading && selectedProblemStatement === 'Loading...' ? (
            <div className="flex items-center gap-2 justify-center">
              <Loader className="w-4 h-4 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Loading problem statement...</span>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left">{selectedProblemStatement}</h3>
              <p className="text-sm text-gray-600 text-center sm:text-left">This is your selected problem statement for the hackathon.</p>
            </>
          )}
        </div>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
          onClick={() => {
            const event = new CustomEvent('changeSection', { detail: 'problemStatement' });
            window.dispatchEvent(event);
          }}
        >
          Change Problem Statement
        </button>
      </div>
    </div>
  );
};

export default RightSidePanel;