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
        
            
            if (availableRes.data && availableRes.data.success && availableRes.data.problemStatements) {
              // Check if any problem is already selected by this team
              selectedProblem = availableRes.data.problemStatements.find(p => 
                p._id === teamProblemId
              );
            
            } else if (availableRes.data && availableRes.data.problemStatements) {
              // Fallback if success flag missing but data exists
              selectedProblem = availableRes.data.problemStatements.find(p => 
                p._id === teamProblemId
              );
            }
          } catch (availableErr) {
            console.error('getActiveForTeam API error:', availableErr);
           
          }
          
          // Method 3: Try to get all problem statements and find the selected one
          if (!selectedProblem && teamProblemId) {
            try {
           
              const allProblemsRes = await problemStatementAPI.getAll();
            
              if (allProblemsRes.data && allProblemsRes.data.problemStatements) {
                selectedProblem = allProblemsRes.data.problemStatements.find(p => p._id === teamProblemId);
               
              }
            } catch (allErr) {
             
            }
          }

          // Method 4: Try to get fresh team data from leader profile
          if (!selectedProblem) {
            try {
             
              const profileRes = await userAPI.getLeaderProfile();
             
              
              if (profileRes.data && profileRes.data.team) {
                const freshTeam = profileRes.data.team;
                const freshProblemId = freshTeam.selectedProblemStatement || freshTeam.teamProblemStatement;
                
                if (freshProblemId) {
                 
                  // Try to get this problem's details
                  try {
                    const allProblemsRes = await problemStatementAPI.getAll();
                    if (allProblemsRes.data && allProblemsRes.data.problemStatements) {
                      selectedProblem = allProblemsRes.data.problemStatements.find(p => p._id === freshProblemId);
                     
                    }
                  } catch (err) {
                    console.error('Could not fetch problem details:', err);
                  }
                }
              }
            } catch (profileErr) {
              console.error('Leader profile API error:', profileErr);
            }
          }

          // Method 5: Fallback to legacy API
          if (!selectedProblem) {
            try {
             
              const legacyRes = await problemStatementAPI.getByTeam(teamId);
             
              let problem = null;
              
              if (legacyRes.data.problemStatements && Array.isArray(legacyRes.data.problemStatements) && legacyRes.data.problemStatements.length > 0) {
                problem = legacyRes.data.problemStatements[0];
               
              } else if (legacyRes.data.problemStatement) {
                problem = legacyRes.data.problemStatement;
               
              } else if (legacyRes.data && legacyRes.data.PStitle) {
                // Direct problem statement in response
                problem = legacyRes.data;
               
              }
              
              selectedProblem = problem;
            } catch (legacyErr) {
              console.error('Legacy API error:', legacyErr);
             
            }
          }
          
          // Update state
          if (selectedProblem) {
            const problemTitle = selectedProblem.PStitle || selectedProblem.title || selectedProblem.problemTitle || 'Problem statement selected';
            setSelectedProblemStatement(problemTitle);
            
          } else {
            // Check if team has any problem statement data at all
            const hasAnyProblemData = hackathonUser?.team?.problemStatement || 
                                      hackathonUser?.team?.selectedProblemStatement || 
                                      hackathonUser?.team?.teamProblemStatement;
            
            if (hasAnyProblemData) {
              setSelectedProblemStatement('Problem statement selected (details unavailable)');
             
            } else {
              setSelectedProblemStatement('No problem statement selected');
              
            }
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
    <div className="sm:space-y-6 p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Selected Theme Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 sm:mb-5">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2A4A] flex-shrink-0" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 text-center sm:text-left w-full sm:w-auto">Selected Theme</h2>
        </div>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
          {loading && selectedTheme === 'Loading...' ? (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Loader className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-600">Loading theme...</span>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left text-sm sm:text-base break-words">
                {selectedTheme}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                This is your selected theme for the hackathon.
              </p>
            </>
          )}
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base font-medium"
          onClick={() => {
            const event = new CustomEvent('changeSection', { detail: 'projectTheme' });
            window.dispatchEvent(event);
          }}
        >
          Change Theme
        </button>
      </div>

      {/* Selected Problem Statement Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 sm:mb-5">
          <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-[#0B2A4A] flex-shrink-0" />
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 text-center sm:text-left w-full sm:w-auto">Selected Problem Statement</h2>
        </div>
        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 mb-4">
          {loading && selectedProblemStatement === 'Loading...' ? (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <Loader className="w-4 h-4 animate-spin text-blue-600 flex-shrink-0" />
              <span className="text-sm text-gray-600">Loading problem statement...</span>
            </div>
          ) : (
            <>
              <h3 className="font-medium text-gray-900 mb-2 text-center sm:text-left text-sm sm:text-base break-words">
                {selectedProblemStatement}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                This is your selected problem statement for the hackathon.
              </p>
            </>
          )}
        </div>
        <button
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all text-sm sm:text-base font-medium"
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