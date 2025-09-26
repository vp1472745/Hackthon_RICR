import React, { useEffect, useState } from 'react';
import { 
  Target, 
  Timer,
  Play,
  FileText,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

import { teamAPI } from '../../../../configs/api';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

const RightSidePanel = ({ timeLeft }) => {
  const [selectedTheme, setSelectedTheme] = useState(null);

  useEffect(() => {
    const teamId = getCookie('teamId');
    if (!teamId) {
      setSelectedTheme(null);
      return;
    }
    teamAPI.getTeamDetails(teamId)
      .then(res => {
        setSelectedTheme(res.data.teamTheme || null);
      })
      .catch(() => setSelectedTheme(null));
  }, []);

  return (
    <div className="space-y-6">
      {/* Countdown Timer */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <Timer className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800">Hackathon Countdown</h2>
        </div>

        {/* Timer Display */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
            <div className="text-2xl font-bold">{timeLeft.days}</div>
            <div className="text-xs opacity-80">Days</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
            <div className="text-2xl font-bold">{timeLeft.hours}</div>
            <div className="text-xs opacity-80">Hours</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
            <div className="text-2xl font-bold">{timeLeft.minutes}</div>
            <div className="text-xs opacity-80">Minutes</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-[#0B2A4A] to-blue-600 rounded-lg text-white">
            <div className="text-2xl font-bold">{timeLeft.seconds}</div>
            <div className="text-xs opacity-80">Seconds</div>
          </div>
        </div>

        {/* Start Button (Disabled) */}
        <button 
          disabled
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          Start Hackathon (Coming Soon)
        </button>
        
        <p className="text-center text-xs text-gray-500 mt-2">
          Button will be enabled when hackathon begins
        </p>
      </div>

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
            <p className="text-sm text-gray-600">
              Great choice! You've successfully selected your hackathon theme. 
              Make sure to review the problem statement and requirements.
            </p>
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

        {selectedTheme ? (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Challenge Overview</h3>
              <p className="text-sm text-gray-600 mb-3">
                Your selected theme: <span className="font-semibold text-[#0B2A4A]">{selectedTheme}</span>
              </p>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Key Requirements:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Innovative solution addressing real-world problems</li>
                  <li>Technical implementation with proper documentation</li>
                  <li>Working prototype or MVP</li>
                  <li>Clear presentation and demonstration</li>
                </ul>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800 font-medium">
                💡 Tip: Review the detailed problem statement in the Project Theme section for complete guidelines.
              </p>
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