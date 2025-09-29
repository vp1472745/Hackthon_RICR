import React from 'react';
import { Target, FileText } from 'lucide-react';

const RightSidePanel = () => {
  let selectedTheme = JSON.parse(sessionStorage.getItem('hackathonUser'))?.theme?.themeName || 'No theme selected';
  const selectedProblemStatement = JSON.parse(sessionStorage.getItem('hackathonUser'))?.team?.teamProblemStatement || 'No problem statement selected';

  console.log("Selected Theme in RightSidePanel:", selectedTheme);

  return (
    <div className="space-y-6">
      {/* Selected Theme Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800">Selected Theme</h2>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-2">{selectedTheme}</h3>
          <p className="text-sm text-gray-600">This is your selected theme for the hackathon.</p>
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-[#0B2A4A]" />
          <h2 className="text-lg font-semibold text-gray-800">Selected Problem Statement</h2>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
          <h3 className="font-medium text-gray-900 mb-2">{selectedProblemStatement}</h3>
          <p className="text-sm text-gray-600">This is your selected problem statement for the hackathon.</p>
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