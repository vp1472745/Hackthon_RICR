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

  const handleThemeSelect = (themeName) => {
    setSelectedTheme(themeName);
    sessionStorage.setItem('selectedTheme', themeName);
    setIsStep3Saved(true); // Notify MultiStepModal that Step3 is saved
    setIsNextDisabled(false); // Enable Next button when a theme is selected
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg">
      {/* Error */}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Loading */}
      {loading && <div className="text-center text-gray-600">Loading...</div>}

      {/* Theme Selection Section */}
      <div className="space-y-4">
        {themes.map((theme, idx) => (
          <button
            key={idx}
            onClick={() => handleThemeSelect(theme.name)}
            className={`block w-full text-left px-4 py-2 rounded-md shadow-sm ${
              selectedTheme === theme.name
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {theme.name}
          </button>
        ))}
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
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${
            selectedTheme
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
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
