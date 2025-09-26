import React, { useState, useEffect } from 'react';
import { Lightbulb, CheckCircle, Star } from 'lucide-react';
import { projectThemeAPI, teamAPI } from '../../../configs/api';

const ProjectTheme = () => {
  const [themes, setThemes] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }
  const teamId = getCookie('teamId');

  useEffect(() => {
    if (!teamId) {
      alert('Team ID not found! Please log in again.');
    }
  }, [teamId]);

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

  useEffect(() => {
    if (!teamId) return;
    const fetchTeamTheme = async () => {
      try {
        const res = await teamAPI.getTeamDetails(teamId);
        setSelectedTheme(res.data.teamTheme || null);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTeamTheme();
  }, [teamId]);

  const handleThemeSelect = (themeName) => {
    if (selectedTheme === themeName) return;
    setPendingSelection(themeName);
    setShowConfirmation(true);
  };

  const confirmSelection = async () => {
    if (!teamId || !pendingSelection) return;
    setLoading(true);
    try {
      await projectThemeAPI.selectThemeForTeam(teamId, pendingSelection);
      setSelectedTheme(pendingSelection);
      setShowConfirmation(false);
      setPendingSelection(null);
    } catch (err) {
      console.error(err);
      alert('Failed to select theme');
    }
    setLoading(false);
  };

  const cancelSelection = () => {
    setShowConfirmation(false);
    setPendingSelection(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch ((difficulty || '').toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const selectedThemeData = themes.find(theme => theme.themeName === selectedTheme);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Lightbulb className="w-6 h-6 text-[#0B2A4A]" />
              <h1 className="text-2xl font-bold text-gray-800">Project Themes</h1>
            </div>
            <p className="text-gray-600">
              Choose a theme for your hackathon project. You can change your selection until November 6, 2025.
            </p>
          </div>
          {selectedTheme && (
            <div className="text-right flex flex-col items-end">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Theme Selected</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {selectedThemeData?.themeName}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && <div className="text-red-600 text-center">{error}</div>}

      {/* Loading */}
      {loading && <div className="text-center text-gray-600">Loading...</div>}

      {/* Theme Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {themes.map(theme => {
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

              <div className="px-6 pb-4 flex items-center justify-between">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(theme.difficulty)}`}>
                  {theme.difficulty || 'N/A'}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <span className="text-xs text-gray-600">{theme.popularity ? `${theme.popularity}% popular` : ''}</span>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : 'bg-[#0B2A4A] text-white hover:bg-[#0d2d4f]'
                  }`}
                  disabled={isSelected}
                >
                  {isSelected ? 'Selected' : 'Select Theme'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Theme Selection</h3>
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{pendingSelection}</div>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Are you sure you want to select this theme? You can change it until November 6, 2025.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmSelection}
                  className="flex-1 px-4 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
                  disabled={loading}
                >
                  Confirm Selection
                </button>
                <button
                  onClick={cancelSelection}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectTheme;
