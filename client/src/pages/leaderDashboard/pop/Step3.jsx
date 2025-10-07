import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';
import { projectThemeAPI, homeAPI } from '../../../configs/api';

const Step3 = ({ setIsStep3Saved, handleBack, handleNext }) => {

  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitedTheme, setLimitedTheme] = useState(null);

  // Get teamId from cookie
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  const teamId = getCookie('teamId');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
   
        
        if (!teamId) {
          setError('Team ID not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        // Use homeAPI to get themes with team count
        const res = await homeAPI.getAllThemes();
        setThemes(res.data.themes || []);
       
        
        // Check if team already has a selected theme
        const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
        const existingTheme = hackathonUser?.theme?.themeName || 
                             hackathonUser?.team?.teamTheme?.themeName ||
                             sessionStorage.getItem('selectedTheme');
        
        if (existingTheme) {
          setSelectedTheme(existingTheme);
          setIsStep3Saved(true);
        
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to load themes:', err);
        setError('Failed to load themes');
        setLoading(false);
      }
    };
    fetchThemes();
  }, [teamId]);

  const handleThemeSelect = async (themeName) => {
    // Find the theme and check team count
    const theme = themes.find(t => t.themeName === themeName);
    
    if (theme && theme.teamCount >= 10) {
      setLimitedTheme(theme);
      setShowLimitModal(true);
      return;
    }

    try {
      setLoading(true);
      setSelectedTheme(themeName);
      sessionStorage.setItem('selectedTheme', themeName);
      
      const res = await projectThemeAPI.selectThemeForTeam(teamId, themeName);
    
      // Update hackathonUser sessionStorage with selected theme
      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
      const selectedThemeObj = themes.find(theme => theme.themeName === themeName);
      
      if (hackathonUser && selectedThemeObj) {
        // Update theme in hackathonUser
        hackathonUser.theme = selectedThemeObj;
        
        // Also update team's theme if team exists
        if (hackathonUser.team) {
          hackathonUser.team.teamTheme = selectedThemeObj;
        }
        
        // Save updated hackathonUser back to sessionStorage
        sessionStorage.setItem('hackathonUser', JSON.stringify(hackathonUser));
      
      }
      
      // Mark step as completed
      setIsStep3Saved(true);
      
      setLoading(false);
    } catch (error) {
      console.error('Error selecting theme:', error);
      setError('Failed to select theme. Please try again.');
      setLoading(false);
    }
  };



  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Error */}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Loading */}
      {loading && <div className="text-center text-gray-600">Loading...</div>}

      {/* Theme Selection Header */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Select Your Theme</h2>
      
      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.themeName;
          return (
            <div
              key={theme._id}
              className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 ${
                theme.teamCount >= 10 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'cursor-pointer hover:shadow-lg'
              } ${
                isSelected
                  ? 'border-green-500 ring-2 ring-green-200'
                  : theme.teamCount >= 10
                    ? 'border-red-200'
                    : 'border-gray-200 hover:border-[#0B2A4A]'
              }`}
              onClick={() => handleThemeSelect(theme.themeName)}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 text-green-500">
                  <CheckCircle className="w-6 h-6" />
                </div>
              )}

              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{theme.themeName}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">{theme.themeShortDescription}</p>
                
                {/* Team Count and Limit */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{theme.teamCount || 0}/10 teams selected</span>
                  {theme.teamCount >= 10 && (
                    <span className="text-red-500 font-medium">Full</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Theme Confirmation */}
      {selectedTheme && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Theme Selected Successfully!</p>
              <p className="text-sm text-green-700">You have selected: <strong>{selectedTheme}</strong></p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-6 flex justify-between gap-2">
        <button
          className="px-5 py-2 rounded-lg font-semibold transition-colors bg-gray-100 text-[#0B2A4A] hover:bg-gray-200"
          onClick={handleBack}
          disabled={loading}
        >
          Back
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
            selectedTheme 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleNext}
          disabled={!selectedTheme || loading}
        >
          {loading ? 'Selecting...' : 'Next'}
        </button>
      </div>

      {/* Theme Limit Modal */}
      {showLimitModal && limitedTheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Theme Selection Limit Reached
              </h3>
              
              <p className="text-gray-600 mb-4">
                <strong>"{limitedTheme.themeName}"</strong> has reached its maximum capacity of 10 teams. 
                Please select a different theme.
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-6">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{limitedTheme.teamCount}/10</span> teams have already selected this theme.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowLimitModal(false);
                    setLimitedTheme(null);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Choose Another Theme
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step3;
