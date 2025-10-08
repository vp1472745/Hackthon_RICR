import React, { useState, useEffect } from 'react';
import {
  FiDownload,
  FiUpload,
  FiRefreshCw,
  FiEdit3,
  FiTrash2,
  FiFileText,
  FiAward,
  FiGithub,
  FiFilter,
  FiSearch,
  FiCheckCircle
} from 'react-icons/fi';
import { resultAPI, AdminAPI } from '../../../configs/api';
import { toast } from 'react-hot-toast';
import EditResultModal from '../Tab/modals/EditResultModal.jsx';
import ReconfirmModal from './modals/ReconfirmModal.jsx';

const ResultManageTab = () => {
  // State management
  const [results, setResults] = useState([]);
  const [allTeams, setAllTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingExcel, setDownloadingExcel] = useState(false);
  const [uploadingExcel, setUploadingExcel] = useState(false);

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('overAll');
  const [sortOrder, setSortOrder] = useState('desc');

  // Modal states
  const [actionType, setActionType] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingResult, setEditingResult] = useState(null);
  const [reconfirmModal, setReconfirmModal] = useState(false);

  // Form data for create/edit
  const [formData, setFormData] = useState({
    teamId: '',
    ui: 0,
    ux: 0,
    presentation: 0,
    viva: 0,
    overAll: 0,
    codeQuality: 0
  });

  // Fetch data
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    await Promise.all([
      fetchResults(),
      fetchAllTeams()
    ]);
  };

  const fetchAllTeams = async () => {
    try {
      const response = await AdminAPI.getAllTeams();
      if (response.data && response.data.teams) {
        setAllTeams(response.data.teams);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await resultAPI.getResultsWithTeamAndLeader();
      if (response.data && response.data.success) {
        const fetchedResults = response.data.results || [];
        setResults(fetchedResults);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setError(err.message || 'Failed to fetch results');
      toast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  // Download Excel/CSV functionality
  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);
      const allTeamsData = combineTeamsWithResults();

      const exportData = allTeamsData.map(item => ({
        'Team Name': item.team?.teamName || 'N/A',
        'Team Code': item.team?.teamCode || 'N/A',
        'Leader Name': item.leader?.fullName || 'N/A',
        'GitHub Profile': item.leader?.GitHubProfile || 'No GitHub',
        'Presentation (10)': 0,
        'UI (10)': 0,
        'UX (10)': 0,
        'Code Quality (20)': 0,
        'Viva (20)': 0,
        'Overall (30)': 0,
      }));

      // CSV fallback implementation
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date().toISOString().slice(0, 10);
      link.download = `hackathon_results_${today}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`CSV file downloaded successfully! (${allTeamsData.length} teams)`);
    } catch (err) {
      console.error('Error downloading file:', err);
      toast.error('Failed to download file: ' + err.message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  const handleDownloadResults = async () => {
    try {
      setDownloadingExcel(true);
      const allTeamsData = combineTeamsWithResults();

      const exportData = allTeamsData.map(item => ({
        'Team Name': item.team?.teamName || 'N/A',
        'Team Code': item.team?.teamCode || 'N/A',
        'Leader Name': item.leader?.fullName || 'N/A',
        'GitHub Profile': item.leader?.GitHubProfile || 'No GitHub',
        'Presentation (10)': item.presentation || 0,
        'UI (10)': item.ui || 0,
        'UX (10)': item.ux || 0,
        'Code Quality (20)': item.codeQuality || 0,
        'Viva (20)': item.viva || 0,
        'Overall (30)': item.overAll || 0,
        'Obtained Marks': item.obtainedMarks || 0,
        'Grade': item.grade || 'N/A',
      }));

      // CSV implementation
      const headers = Object.keys(exportData[0]);
      const csvContent = [
        headers.join(','),
        ...exportData.map(row =>
          headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
              return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
          }).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const today = new Date().toISOString().slice(0, 10);
      link.download = `hackathon_results_${today}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`CSV file downloaded successfully! (${allTeamsData.length} teams)`);
    } catch (err) {
      console.error('Error downloading file:', err);
      toast.error('Failed to download file: ' + err.message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  // Delete and declare functions
  const handleDeleteAllResults = async () => {
    toast(
      (t) => (
        <div>
          <div className="font-semibold mb-2">Are you sure you want to delete all results?</div>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  setLoading(true);
                  setReconfirmModal(true);
                  setActionType('delete');
                } catch (err) {
                  toast.error("Failed to delete all results");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Yes, Delete
            </button>
            <button
              className="px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  const handleDeclareAllResults = async () => {
    toast(
      (t) => (
        <div>
          <div className="font-semibold mb-2">Are you sure you want to declare all results?</div>
          <div className="flex gap-2 mt-2">
            <button
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  setLoading(true);
                  setReconfirmModal(true);
                  setActionType('declare');
                } catch (err) {
                  toast.error("Failed to declare all results");
                } finally {
                  setLoading(false);
                }
              }}
            >
              Yes, Declare
            </button>
            <button
              className="px-3 py-1 bg-red-200 text-red-700 rounded hover:bg-red-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 8000 }
    );
  };

  // Upload Excel functionality
  const handleUploadExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadingExcel(true);
      const response = await resultAPI.importExcel(file);

      if (response.data && response.data.success) {
        toast.success(`Successfully imported ${response.data.importedCount} results!`);
        fetchResults();
      }
    } catch (err) {
      console.error('Error uploading Excel:', err);
      toast.error('Failed to upload Excel file');
    } finally {
      setUploadingExcel(false);
      event.target.value = '';
    }
  };

  // Combine teams with their results
  const combineTeamsWithResults = () => {
    return allTeams.map(team => {
      const result = results.find(r => r.teamId === team._id);
      const leader = team.members?.find(member => member.role === 'Leader');

      return {
        _id: result?._id || team._id,
        resultId: result?._id,
        teamId: team._id,
        team: {
          teamName: team.teamName,
          teamCode: team.teamCode,
        },
        leader: leader ? {
          fullName: leader.fullName,
          GitHubProfile: leader.GitHubProfile
        } : null,
        ui: result?.ui || 0,
        ux: result?.ux || 0,
        presentation: result?.presentation || 0,
        viva: result?.viva || 0,
        overAll: result?.overAll || 0,
        codeQuality: result?.codeQuality || 0,
        obtainedMarks: result?.obtainedMarks?.toFixed(2) || 0,
        grade: result?.grade || 'N/A',
        hasResult: !!result
      };
    });
  };

  // Filter and sort combined data
  const allTeamsData = combineTeamsWithResults();

  const filteredAndSortedResults = allTeamsData
    .filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.team?.teamName?.toLowerCase().includes(searchLower) ||
        item.team?.teamCode?.toLowerCase().includes(searchLower) ||
        item.leader?.fullName?.toLowerCase().includes(searchLower) ||
        item.leader?.GitHubProfile?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      let aValue, bValue;

      if (sortBy === 'teamName' || sortBy === 'teamCode' || sortBy === 'leaderName') {
        aValue = a[sortBy === 'leaderName' ? 'leader'?.fullName : `team.${sortBy}`] || '';
        bValue = b[sortBy === 'leaderName' ? 'leader'?.fullName : `team.${sortBy}`] || '';

        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        aValue = Number(a[sortBy]) || 0;
        bValue = Number(b[sortBy]) || 0;

        if (sortOrder === 'asc') {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }
    });

  // Calculate statistics
  const stats = {
    totalTeams: allTeams.length,
    teamsWithResults: results.length,
    avgOverall: results.length > 0 ? (results.reduce((sum, r) => sum + (r.overAll || 0), 0) / results.length).toFixed(1) : 0,
    maxScore: results.length > 0 ? Math.max(...results.map(r => r.overAll || 0)) : 0
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">Loading results...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 text-xl mb-2">Error Loading Results</div>
          <div className="text-red-500 mb-4">{error}</div>
          <button
            onClick={fetchAllData}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
            <FiAward className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500" />
            Result Management
          </h2>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage hackathon results and export data</p>
        </div>
      </div>

      {/* Action Buttons - Responsive Grid with Full Text */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        <button
          onClick={fetchAllData}
          className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <FiRefreshCw className="w-4 h-4 flex-shrink-0" />
          <span>Refresh</span>
        </button>

        <button
          onClick={handleDownloadExcel}
          disabled={downloadingExcel || allTeams.length === 0}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <FiDownload className="w-4 h-4 flex-shrink-0" />
          <span>{downloadingExcel ? 'Downloading...' : "Download Raw Excel"}</span>
        </button>

        <label className="px-3 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer">
          <FiUpload className="w-4 h-4 flex-shrink-0" />
          <span>{uploadingExcel ? 'Uploading...' : 'Upload Results Excel'}</span>
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleUploadExcel}
            className="hidden"
            disabled={uploadingExcel}
          />
        </label>

        <button
          onClick={handleDownloadResults}
          disabled={downloadingExcel || allTeams.length === 0}
          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <FiDownload className="w-4 h-4 flex-shrink-0" />
          <span>{downloadingExcel ? 'Downloading...' : "Download Results Excel"}</span>
        </button>

        <button
          onClick={handleDeleteAllResults}
          disabled={loading || stats.teamsWithResults === 0}
          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <FiTrash2 className="w-4 h-4 flex-shrink-0" />
          <span>{loading ? 'Deleting...' : `Delete All Results (${stats.teamsWithResults})`}</span>
        </button>

        <button
          onClick={handleDeclareAllResults}
          disabled={loading || stats.teamsWithResults === 0}
          className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
        >
          <FiCheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>{loading ? 'Declaring...' : "Declare All Results"}</span>
        </button>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search by team name, team code, or GitHub profile..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                setSortOrder(newOrder);
              }}
              className={`px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center ${sortOrder === 'asc' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-orange-50 border-orange-300 text-orange-700'
                }`}
            >
              <FiFilter className="w-4 h-4" />
              <span className="text-sm font-bold">
                {sortOrder === 'asc' ? '↑' : '↓'}
              </span>
              <span className="text-xs font-medium">
                {sortOrder === 'asc' ? 'ASC' : 'DESC'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredAndSortedResults.length === 0 ? (
          <div className="p-8 sm:p-12 text-center">
            <FiFileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
            <p className="text-gray-500 text-sm sm:text-base">
              {searchTerm ? 'No results match your search criteria.' : 'No results have been uploaded yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full hidden lg:table">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['teamName', 'GitHub', 'presentation', 'ui', 'ux', 'codeQuality', 'viva', 'overAll', 'obtainedMarks', 'grade', 'actions'].map((column) => (
                    <th
                      key={column}
                      className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => column !== 'GitHub' && column !== 'actions' && setSortBy(column === 'GitHub' ? 'leaderName' : column)}
                    >
                      <div className={`flex items-center gap-1 ${column === 'GitHub' || column === 'actions' ? '' : 'justify-center'}`}>
                        {column === 'teamName' && 'Team Info'}
                        {column === 'GitHub' && 'GitHub'}
                        {column === 'presentation' && 'Pres'}
                        {column === 'ui' && 'UI'}
                        {column === 'ux' && 'UX'}
                        {column === 'codeQuality' && 'Code'}
                        {column === 'viva' && 'Viva'}
                        {column === 'overAll' && 'Overall'}
                        {column === 'obtainedMarks' && 'Marks'}
                        {column === 'grade' && 'Grade'}
                        {column === 'actions' && 'Actions'}
                        {sortBy === column && column !== 'GitHub' && column !== 'actions' && (
                          <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedResults.map((item, index) => (
                  <tr key={item._id || index} className={`hover:bg-gray-50 transition-colors ${!item.hasResult ? 'bg-yellow-50' : ''}`}>
                    <td className="px-3 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm flex items-center gap-2">
                          {item.team?.teamName || 'N/A'}
                          {!item.hasResult && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              No Result
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.team?.teamCode || 'No Code'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.leader?.fullName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <FiGithub className="w-4 h-4 text-gray-400" />
                        {item.leader?.GitHubProfile ? (
                          <a
                            href={item.leader.GitHubProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs truncate max-w-[120px]"
                          >
                            Visit
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">No GitHub</span>
                        )}
                      </div>
                    </td>
                    {['presentation', 'ui', 'ux', 'codeQuality', 'viva', 'overAll', 'obtainedMarks', 'grade'].map((field) => (
                      <td key={field} className="px-3 py-4 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          field === 'overAll' ? 'bg-yellow-100 text-yellow-800' :
                          field === 'obtainedMarks' ? 'bg-pink-100 text-pink-800' :
                          field === 'grade' ? 'bg-fuchsia-100 text-fuchsia-800' :
                          field === 'presentation' ? 'bg-purple-100 text-purple-800' :
                          field === 'ui' ? 'bg-blue-100 text-blue-800' :
                          field === 'ux' ? 'bg-green-100 text-green-800' :
                          field === 'codeQuality' ? 'bg-indigo-100 text-indigo-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {item[field] || 0}
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingResult(item);
                            setFormData({
                              teamId: item.teamId,
                              ui: item.ui || 0,
                              ux: item.ux || 0,
                              presentation: item.presentation || 0,
                              viva: item.viva || 0,
                              overAll: item.overAll || 0,
                              codeQuality: item.codeQuality || 0
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title={item.hasResult ? "Edit Result" : "Add Result"}
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        {item.hasResult && (
                          <button
                            onClick={async () => {
                              if (window.confirm(`Are you sure you want to delete result for team "${item.team?.teamName}"?`)) {
                                try {
                                  setLoading(true);
                                  await resultAPI.deleteResult(item.resultId);
                                  toast.success('Result deleted successfully!');
                                  fetchResults();
                                } catch (error) {
                                  console.error('Error deleting result:', error);
                                  toast.error('Failed to delete result');
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Result"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {filteredAndSortedResults.map((item, index) => (
                <div key={item._id || index} className={`p-4 hover:bg-gray-50 transition-colors ${!item.hasResult ? 'bg-yellow-50' : ''}`}>
                  <div className="space-y-3">
                    {/* Team Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-medium text-gray-900 text-sm">
                            {item.team?.teamName || 'N/A'}
                          </div>
                          {!item.hasResult && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              No Result
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          Code: {item.team?.teamCode || 'No Code'} | Leader: {item.leader?.fullName || 'N/A'}
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <FiGithub className="w-3 h-3 text-gray-400" />
                          {item.leader?.GitHubProfile ? (
                            <a
                              href={item.leader.GitHubProfile}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 truncate"
                            >
                              GitHub Profile
                            </a>
                          ) : (
                            <span className="text-gray-400">No GitHub</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            setEditingResult(item);
                            setFormData({
                              teamId: item.teamId,
                              ui: item.ui || 0,
                              ux: item.ux || 0,
                              presentation: item.presentation || 0,
                              viva: item.viva || 0,
                              overAll: item.overAll || 0,
                              codeQuality: item.codeQuality || 0
                            });
                            setShowEditModal(true);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                          title={item.hasResult ? "Edit Result" : "Add Result"}
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        {item.hasResult && (
                          <button
                            onClick={async () => {
                              if (window.confirm(`Delete result for ${item.team?.teamName}?`)) {
                                try {
                                  setLoading(true);
                                  await resultAPI.deleteResult(item.resultId);
                                  toast.success('Result deleted!');
                                  fetchResults();
                                } catch (error) {
                                  toast.error('Failed to delete result');
                                } finally {
                                  setLoading(false);
                                }
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Result"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Scores Grid */}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Pres', value: item.presentation || 0, color: 'bg-purple-100 text-purple-800' },
                        { label: 'UI', value: item.ui || 0, color: 'bg-blue-100 text-blue-800' },
                        { label: 'UX', value: item.ux || 0, color: 'bg-green-100 text-green-800' },
                        { label: 'Code', value: item.codeQuality || 0, color: 'bg-indigo-100 text-indigo-800' },
                        { label: 'Viva', value: item.viva || 0, color: 'bg-orange-100 text-orange-800' },
                        { label: 'Overall', value: item.overAll || 0, color: 'bg-yellow-100 text-yellow-800' },
                        { label: 'Marks', value: item.obtainedMarks || 0, color: 'bg-pink-100 text-pink-800' },
                        { label: 'Grade', value: item.grade || 'N/A', color: 'bg-fuchsia-100 text-fuchsia-800' },
                      ].map((score, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-xs text-gray-500 mb-1">{score.label}</div>
                          <span className={`inline-flex items-center justify-center w-full px-2 py-1 rounded-full text-xs font-medium ${score.color}`}>
                            {score.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="text-center text-xs sm:text-sm text-gray-500">
        Showing {filteredAndSortedResults.length} of {allTeams.length} teams
        ({stats.teamsWithResults} have results)
        {searchTerm && (
          <span className="ml-1">
            (filtered by "{searchTerm}")
          </span>
        )}
      </div>

      {/* Modals */}
      <EditResultModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        editingResult={editingResult}
        setEditingResult={setEditingResult}
        formData={formData}
        setFormData={setFormData}
        loading={loading}
        setLoading={setLoading}
        fetchResults={fetchResults}
      />

      <ReconfirmModal
        showModal={reconfirmModal}
        setShowModal={setReconfirmModal}
        onConfirm={async () => {
          try {
            setLoading(true);
            if (actionType === 'delete') {
              await resultAPI.deleteAllResults();
              toast.success('Results deleted successfully!');
            } else if (actionType === 'declare') {
              await resultAPI.declareAllResults();
              toast.success('Results declared successfully!');
            }
            fetchResults();
          } catch (error) {
            console.error('Error confirming action:', error);
            toast.error('Failed to confirm action');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
};

export default ResultManageTab;