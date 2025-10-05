import React from 'react';

const dummyResults = [
  { id: 1, team: 'Alpha Coders', theme: 'AI & ML', position: 1, score: 98 },
  { id: 2, team: 'Green Innovators', theme: 'Sustainability', position: 2, score: 92 },
  { id: 3, team: 'FinTech Pros', theme: 'FinTech', position: 3, score: 89 },
];

const ResultManageTab = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4 lg:px-2 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50" style={{maxHeight: 'calc(100vh - 48px)'}}>
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-blue-900 text-center sm:text-left">Result Management</h2>
        <p className="text-gray-600 text-xs sm:text-sm mt-1 text-center sm:text-left">
          View and manage competition results
        </p>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow border border-blue-50">
          <thead>
            <tr className="bg-blue-100 text-blue-900">
              <th className="py-3 px-4 text-left text-sm font-semibold">Team</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Theme</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Position</th>
              <th className="py-3 px-4 text-left text-sm font-semibold">Score</th>
            </tr>
          </thead>
          <tbody>
            {dummyResults.map((result) => (
              <tr key={result.id} className="border-t hover:bg-blue-50 transition">
                <td className="py-3 px-4 font-medium text-sm">{result.team}</td>
                <td className="py-3 px-4 text-sm">{result.theme}</td>
                <td className="py-3 px-4 font-bold text-blue-700 text-sm">{result.position}</td>
                <td className="py-3 px-4 text-sm">{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {dummyResults.map((result) => (
          <div key={result.id} className="bg-white rounded-xl shadow border border-blue-50 p-4 hover:bg-blue-50 transition">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-blue-900 text-sm">{result.team}</h3>
                <p className="text-gray-600 text-xs mt-1">{result.theme}</p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs font-bold">
                  #{result.position}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-gray-600 text-xs">Score:</span>
              <span className="font-semibold text-blue-900 text-sm">{result.score}/100</span>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {dummyResults.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No results available yet</p>
        </div>
      )}
    </div>
  );
};

export default ResultManageTab;