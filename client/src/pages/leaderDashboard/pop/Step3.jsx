import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle } from 'lucide-react';
import { projectThemeAPI } from '../../../configs/api';

const Step3 = ({ setIsStep3Saved, handleBack, handleNext }) => {

   const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        setLoading(true);
        const res = await projectThemeAPI.getAllThemes();
        setThemes(res.data.themes || []);
        setLoading(false);
      } catch {
        setError('Failed to load themes');
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const handleThemeSelect =async (themeName) => {
    try {
      setSelectedTheme(themeName);
      sessionStorage.setItem('selectedTheme', themeName);
      const res = await projectThemeAPI.selectThemeForTeam(teamId, themeName);
      console.log('Theme stored in sessionStorage:', themeName); // Debugging log
      setIsStep3Saved(true); // Notify MultiStepModal that Step3 is saved
      setIsNextDisabled(false); // Enable Next button when a theme is selected
    } catch (error) {
      console.error('Error storing theme in sessionStorage:', error);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50">
      {/* Error */}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Loading */}
      {loading && <div className="text-center text-gray-600">Loading...</div>}

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme) => {
          const isSelected = selectedTheme === theme.themeName;
          return (
            <div
              key={theme._id}
              className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-300 cursor-pointer hover:shadow-lg ${
                isSelected
                  ? 'border-green-500 ring-2 ring-green-200'
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
                <p className="text-sm text-gray-600 leading-relaxed">{theme.themeDescription}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-3 flex justify-between gap-2">
        <button
          className="px-5 py-2 rounded-lg font-semibold transition-colors bg-gray-100 text-[#0B2A4A] hover:bg-gray-200"
          onClick={handleBack}
        >
          Back
        </button>
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${selectedTheme ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}
          disabled={!selectedTheme}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3;
