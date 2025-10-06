import React, { useState, useEffect } from 'react';
import { problemStatementAPI } from '../../configs/api.js';
import { FileText, AlertCircle, Loader, Lightbulb, Calendar, Target, Users, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ProblemStatements = () => {
  const [availableProblems, setAvailableProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selecting, setSelecting] = useState(false);
  const [error, setError] = useState('');
  const [showFetchOption, setShowFetchOption] = useState(false);
  const [hasTheme, setHasTheme] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingProblem, setPendingProblem] = useState(null);
  const [isDeactivatedMode, setIsDeactivatedMode] = useState(false);


  // Get teamId from user info or cookie
  const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser'));
  const teamId = hackathonUser?.team?._id || hackathonUser?.teamId || hackathonUser?.user?.teamId;

  // Check if team has selected a theme
  useEffect(() => {
    const checkTheme = () => {
 
      if (!teamId) {
     
        setError('Team ID not found');
        setLoading(false);
        return;
      }


      
      const teamTheme = hackathonUser?.theme?.themeName || 
                       hackathonUser?.team?.teamTheme?.themeName ||
                       sessionStorage.getItem('selectedTheme');
      

      
      if (teamTheme) {
        setHasTheme(true);
        setShowFetchOption(true);
  
        
 
        setTimeout(() => {
          fetchProblemStatements();
        }, 500);
      } else {
        setError('Please select a theme first before viewing problem statements');
        setHasTheme(false);
     ;
      }
      setLoading(false);
    };

    checkTheme();
  }, [teamId]);

  // Function to fetch problem statements manually
  const fetchProblemStatements = async () => {
   
    if (!teamId) {
   
      setError('Team ID not found');
      return;
    }

    setLoading(true);
    try {
      // Fetch available problem statements for team
      const res = await problemStatementAPI.getActiveForTeam(teamId);

      if (res.data.success) {
        const problems = res.data.problemStatements || [];
        const isDeactivated = res.data.isDeactivated || false;
        
        
        setAvailableProblems(problems);
        setIsDeactivatedMode(isDeactivated);
        
        // If deactivated, automatically set the selected problem (should be only one)
        if (isDeactivated && problems.length > 0) {
        
          setSelectedProblem(problems[0]);
          setError(''); // Clear any errors
          setShowFetchOption(false);
          setLoading(false);
          return;
        }
        

        
        setShowFetchOption(false); // Hide the fetch option after fetching
        setError(''); // Clear any previous errors
        
      } else {
      
        const isDeactivated = res.data.isDeactivated || false;
        
        if (isDeactivated) {
          // Problem statements are deactivated and team has no selection
          setError('Problem statements are currently deactivated by admin. Please contact support.');
          setAvailableProblems([]);
          setSelectedProblem(null);
        } else {
          setError(res.data.message || 'Failed to load problem statements');
        }
      }
    } catch (err) {
      console.error('Fetch error:', err);
  
      // Check if it's a theme issue
      if (err.response?.status === 400) {
        const errorMsg = err.response?.data?.message || 'Bad request';
        setError(errorMsg);
      } else if (err.message?.includes('theme')) {
        setError('Please select a theme first before viewing problem statements');
      } else {
        setError(err.response?.data?.message || 'Failed to load problem statements');
      }
    } finally {
      setLoading(false);
    }
  };


  // Actual selection after confirmation
  const confirmSelection = async () => {
    if (!teamId || selecting || !pendingProblem) return;
    
    setSelecting(true);
    setShowConfirmModal(false);
    
    try {
      const res = await problemStatementAPI.selectForTeam(teamId, pendingProblem._id);
      
      if (res.data.success) {
        setSelectedProblem(pendingProblem);
        toast.success('Problem statement selected successfully!');
 
        
        // Hide other problem statements - keep only selected one
        const updatedProblems = availableProblems.map(p => ({
          ...p,
          isHidden: p._id !== pendingProblem._id
        }));
        setAvailableProblems(updatedProblems);
 
        
        // Update session storage
        const updatedUser = { ...hackathonUser };
        if (updatedUser.team) {
          updatedUser.team.selectedProblemStatement = pendingProblem._id;
          updatedUser.team.teamProblemStatement = pendingProblem._id;
          sessionStorage.setItem('hackathonUser', JSON.stringify(updatedUser));
        }
      } else {
        toast.error(res.data.message || 'Failed to select problem statement');
      }
    } catch (err) {
      console.error('Selection error:', err);
      toast.error(err.response?.data?.message || 'Failed to select problem statement');
    } finally {
      setSelecting(false);
      setPendingProblem(null);
    }
  };

  // Cancel selection
  const cancelSelection = () => {
    setShowConfirmModal(false);
    setPendingProblem(null);
  };



  if (loading) {
    return (
      <div className="overflow-hidden min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center w-full">
          <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Problem Statement</h3>
          <p className="text-gray-600">Fetching your challenge details...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    const isThemeError = error.includes('theme');
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-8 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Problem Statements</h1>
                <p className="text-gray-600 text-lg">Choose your hackathon challenge</p>
              </div>
            </div>
          </div>
          
          <div className={`${isThemeError ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'} border rounded-2xl p-6 text-center`}>
            <AlertCircle className={`w-12 h-12 ${isThemeError ? 'text-yellow-600' : 'text-red-600'} mx-auto mb-4`} />
            <h3 className={`text-xl font-semibold ${isThemeError ? 'text-yellow-800' : 'text-red-800'} mb-2`}>
              {isThemeError ? 'Theme Selection Required' : 'Error Loading Problem Statements'}
            </h3>
            <p className={`${isThemeError ? 'text-yellow-700' : 'text-red-700'} mb-4`}>{error}</p>
            {isThemeError && (
              <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
                <p className="text-sm text-blue-700">
                  Go to the "Project Themes" section to select your team's theme first.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // No Team Theme State
  if (!loading && availableProblems.length === 0 && !selectedProblem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Problem Statements Available</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              No problem statements are available for your team's theme, or your team hasn't selected a theme yet.
            </p>
            <div className="bg-blue-50 rounded-xl p-4 max-w-md mx-auto">
              <p className="text-sm text-blue-700">
                Please select a theme first, or contact organizers if you believe this is an error.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
  
        {/* Header Section */}
        <div className="p-4 sm:p-6 md:p-8 ">
          <div className="flex flex-row sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex flex-row sm:flex-row items-center gap-3 sm:gap-4">
              <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-lg">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-900 ">Problem Statements</h1>
                <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                  {selectedProblem
                    ? 'Your selected hackathon challenge'
                    : isDeactivatedMode
                      ? 'View available problem statements (Selection disabled)'
                      : 'Choose your hackathon challenge'
                  }
                </p>
              </div>
            </div>
            
  
    

 
        </div>

          {/* Member Permission Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-medium text-amber-800">Member View Only</p>
              <p className="text-sm text-amber-700">Only team leaders can select problem statements. You can view available options here.</p>
            </div>
          </div>

          {/* Status Indicator */}
          {selectedProblem && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Problem Statement Selected by Team Leader</p>
                <p className="text-sm text-green-700">Your team has selected: {selectedProblem.PStitle}</p>
              </div>
            </div>
          )}
          
          {!teamId && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Team Not Found</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Please ensure you're part of a team to view problem statements.
                </p>
              </div>
            </div>
          )}
        </div>


        {/* Fetch Problem Statements Option */}
      
        {showFetchOption && hasTheme && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">View Available Problem Statements</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Your team has selected a theme. Click the button below to view available problem statements for your theme.
            </p>
            <button
              onClick={fetchProblemStatements}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Loading Problem Statements...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  View Problem Statements
                </>
              )}
            </button>
          </div>
        )}

        {/* Main Content - Problem Statements */}
        {selectedProblem ? (
          // Show only selected problem
          <div className="space-y-6">
            {/* Selected Problem Statement Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-green-200 p-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProblem.PStitle}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span>Theme: {selectedProblem.PSTheme?.themeName || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Selected: {new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Problem Description
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
                      {selectedProblem.PSdescription}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Understand the Problem</h4>
                <p className="text-gray-600 text-sm">Analyze requirements and identify key challenges</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Plan & Collaborate</h4>
                <p className="text-gray-600 text-sm">Discuss approach and divide tasks with your team</p>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Lightbulb className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">Start Building</h4>
                <p className="text-gray-600 text-sm">Begin developing your innovative solution</p>
              </div>
            </div>
          </div>
        ) : (
          // Show available problems for selection
          availableProblems.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Available Problem Statements</h2>
                <div className="text-sm text-gray-500">
                  Choose one problem statement for your team
                </div>
              </div>
              
              {/* Show All Button - appears when some problems are hidden */}
              {availableProblems.some(p => p.isHidden) && (
                <div className="mb-4 text-center">
                  <button
                    onClick={() => {
                      // Show all problems again
                      const updatedProblems = availableProblems.map(p => ({
                        ...p,
                        isHidden: false
                      }));
                      setAvailableProblems(updatedProblems);
                      setSelectedProblem(null);
        
                    }}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Show All Problems Again
                  </button>
                </div>
              )}

              <div className="space-y-4">
                {availableProblems.map((problemStatement, index) => {
                  // Hide problems that are marked as hidden
                  if (problemStatement.isHidden) return null;
                  
                  return (
                    <div key={problemStatement._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{problemStatement.PStitle}</h3>
                            <p className="text-sm text-gray-500">
                              Theme: {problemStatement.PSTheme?.themeName || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {problemStatement.PSdescription}
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <div className="bg-gray-100 text-gray-600 py-2 px-6 rounded-lg font-medium flex items-center">
                          <FileText className="w-4 h-4 inline mr-2" />
                          {selectedProblem && selectedProblem._id === problemStatement._id 
                            ? 'Selected by Team Leader' 
                            : 'Available Problem Statement'}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>

      {/* Confirmation Modal - Disabled for members */}
      {false && showConfirmModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-95 hover:scale-100">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Your Selection</h3>
              <p className="text-gray-600 text-sm">This is a permanent decision that cannot be changed later</p>
            </div>

            {/* Problem Statement Preview */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">Selected Problem Statement:</h4>
              <p className="text-gray-700 font-medium">{pendingProblem?.PStitle}</p>
              <p className="text-gray-600 text-sm mt-2 line-clamp-3">{pendingProblem?.PSdescription}</p>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-800 font-semibold mb-1">⚠️ Important Warning</p>
                  <p className="text-yellow-700">
                    आपको केवल <strong>एक ही मौका</strong> मिलेगा problem statement select करने के लिए। 
                    एक बार select करने के बाद आप इसे बदल नहीं सकेंगे।
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={cancelSelection}
                disabled={selecting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSelection}
                disabled={selecting}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {selecting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Selecting...
                  </>
                ) : (
                  'Yes, Select This Problem'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemStatements;