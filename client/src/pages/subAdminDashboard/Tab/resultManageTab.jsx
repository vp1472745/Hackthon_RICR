import React from 'react';

const dummyResults = [
  { id: 1, team: 'Alpha Coders', theme: 'AI & ML', position: 1, score: 98 },
  { id: 2, team: 'Green Innovators', theme: 'Sustainability', position: 2, score: 92 },
  { id: 3, team: 'FinTech Pros', theme: 'FinTech', position: 3, score: 89 },
];

const ResultManageTab = () => {
  return (
  <div className="w-full max-w-4xl mx-auto py-6 px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50" style={{maxHeight: 'calc(100vh - 48px)'}}>
      <h2 className="text-xl font-bold text-blue-900 mb-6">Result Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-blue-50">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="py-3 px-4 text-left">Team</th>
              <th className="py-3 px-4 text-left">Theme</th>
              <th className="py-3 px-4 text-left">Position</th>
              <th className="py-3 px-4 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            {dummyResults.map((result) => (
              <tr key={result.id} className="border-t hover:bg-blue-50 transition">
                <td className="py-2 px-4 font-medium">{result.team}</td>
                <td className="py-2 px-4">{result.theme}</td>
                <td className="py-2 px-4 font-bold text-blue-700">{result.position}</td>
                <td className="py-2 px-4">{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ResultManageTab;