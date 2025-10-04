import React, { useEffect, useState } from 'react';
import { Target, FileText, Loader } from 'lucide-react';
import { problemStatementAPI, userAPI } from '../../../configs/api';

const RightSidePanel = () => {
  const [selectedTheme, setSelectedTheme] = useState('Loading...');
  const [selectedProblemStatement, setSelectedProblemStatement] = useState('Loading...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser'));
      
      console.log('🔍 Debug - hackathonUser from session:', hackathonUser);
      
      // Fetch theme data
      const themeFromSession = hackathonUser?.theme?.themeName || sessionStorage.getItem('selectedTheme');
      const themeFromTeam = hackathonUser?.team?.teamTheme?.themeName;
      const theme = themeFromSession || themeFromTeam || 'No theme selected';
      setSelectedTheme(theme);

      const teamId = hackathonUser?.team?._id || hackathonUser?.teamId;
      console.log('🔍 Debug - teamId found:', teamId);
      
      if (teamId) {
        try {
          console.log('🔍 Fetching problem statement for team:', teamId);
          
          // Try multiple API methods to get selected problem statement
          let selectedProblem = null;
          
          // Method 1: Check if team has already selected a problem (from team data)
          const teamProblemId = hackathonUser?.team?.selectedProblemStatement || hackathonUser?.team?.teamProblemStatement;
          
          if (teamProblemId) {
            console.log('📋 Team has selected problem ID:', teamProblemId);
          }
          
          // Method 2: Get available problems and check selection
          try {
            console.log('📋 Calling getActiveForTeam API with teamId:', teamId);
            const availableRes = await problemStatementAPI.getActiveForTeam(teamId);
            console.log('📋 Available problems response status:', availableRes.status);
            console.log('📋 Available problems response data:', availableRes.data);
            
            if (availableRes.data && availableRes.data.success && availableRes.data.problemStatements) {
              // Check if any problem is already selected by this team
              selectedProblem = availableRes.data.problemStatements.find(p => 
                p._id === teamProblemId
              );
              
              console.log('📋 Found selected problem:', selectedProblem?.PStitle || selectedProblem?.title);
            } else if (availableRes.data && availableRes.data.problemStatements) {
              // Fallback if success flag missing but data exists
              selectedProblem = availableRes.data.problemStatements.find(p => 
                p._id === teamProblemId
              );
              console.log('📋 Found problem without success flag:', selectedProblem?.PStitle || selectedProblem?.title);
            }
          } catch (availableErr) {
            console.error('❌ getActiveForTeam API error:', availableErr);
            console.error('❌ Error response:', availableErr.response?.data);
            console.error('❌ Error status:', availableErr.response?.status);
          }
          
          // Method 3: Try to get all problem statements and find the selected one
          if (!selectedProblem && teamProblemId) {
            try {
              console.log('📋 Trying to get all problems and find selected one');
              const allProblemsRes = await problemStatementAPI.getAll();
              console.log('📋 All problems response:', allProblemsRes.data);
              
              if (allProblemsRes.data && allProblemsRes.data.problemStatements) {
                selectedProblem = allProblemsRes.data.problemStatements.find(p => p._id === teamProblemId);
                console.log('📋 Found problem by ID in all problems:', selectedProblem?.PStitle || selectedProblem?.title);
              }
            } catch (allErr) {
              console.error('❌ Get all problems error:', allErr);
            }
          }

          // Method 4: Try to get fresh team data from leader profile
          if (!selectedProblem) {
            try {
              console.log('📋 Trying to get fresh team data from leader profile');
              const profileRes = await userAPI.getLeaderProfile();
              console.log('📋 Leader profile response:', profileRes.data);
              
              if (profileRes.data && profileRes.data.team) {
                const freshTeam = profileRes.data.team;
                const freshProblemId = freshTeam.selectedProblemStatement || freshTeam.teamProblemStatement;
                
                if (freshProblemId) {
                  console.log('📋 Found fresh problem ID from team:', freshProblemId);
                  // Try to get this problem's details
                  try {
                    const allProblemsRes = await problemStatementAPI.getAll();
                    if (allProblemsRes.data && allProblemsRes.data.problemStatements) {
                      selectedProblem = allProblemsRes.data.problemStatements.find(p => p._id === freshProblemId);
                      console.log('📋 Found problem from fresh team data:', selectedProblem?.PStitle || selectedProblem?.title);
                    }
                  } catch (err) {
                    console.error('❌ Could not fetch problem details:', err);
                  }
                }
              }
            } catch (profileErr) {
              console.error('❌ Leader profile API error:', profileErr);
            }
          }

          // Method 5: Fallback to legacy API
          if (!selectedProblem) {
            try {
              console.log('📋 Trying legacy getByTeam API with teamId:', teamId);
              const legacyRes = await problemStatementAPI.getByTeam(teamId);
              console.log('📋 Legacy API response:', legacyRes.data);
              let problem = null;
              
              if (legacyRes.data.problemStatements && Array.isArray(legacyRes.data.problemStatements) && legacyRes.data.problemStatements.length > 0) {
                problem = legacyRes.data.problemStatements[0];
                console.log('📋 Found problem from array:', problem.PStitle || problem.title);
              } else if (legacyRes.data.problemStatement) {
                problem = legacyRes.data.problemStatement;
                console.log('📋 Found single problem:', problem.PStitle || problem.title);
              } else if (legacyRes.data && legacyRes.data.PStitle) {
                // Direct problem statement in response
                problem = legacyRes.data;
                console.log('📋 Found direct problem:', problem.PStitle || problem.title);
              }
              
              selectedProblem = problem;
            } catch (legacyErr) {
              console.error('❌ Legacy API error:', legacyErr);
              console.error('❌ Legacy error response:', legacyErr.response?.data);
              console.error('❌ Legacy error status:', legacyErr.response?.status);
            }
          }
          
          // Update state
          if (selectedProblem) {
            const problemTitle = selectedProblem.PStitle || selectedProblem.title || selectedProblem.problemTitle || 'Problem statement selected';
            setSelectedProblemStatement(problemTitle);
            console.log('✅ Problem statement found:', problemTitle);
          } else {
            // Check if team has any problem statement data at all
            const hasAnyProblemData = hackathonUser?.team?.problemStatement || 
                                      hackathonUser?.team?.selectedProblemStatement || 
                                      hackathonUser?.team?.teamProblemStatement;
            
            if (hasAnyProblemData) {
              setSelectedProblemStatement('Problem statement selected (details unavailable)');
              console.log('⚠️ Team has problem statement reference but details not found');
            } else {
              setSelectedProblemStatement('No problem statement selected');
              console.log('❌ No problem statement found for team');
            }
          }
          
        } catch (err) {
          console.error('❌ Error fetching problem statement:', err);
          setSelectedProblemStatement('Error loading problem statement');
        }
      } else {
        console.log('❌ No team ID found');
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