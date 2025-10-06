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
import { subAdminAPI } from '../../../configs/api.js';
import { toast } from 'react-hot-toast';
import EditResultModal from './modals/subEditResultModal.jsx';
import ReconfirmModal from './modals/subReconfirmModal.jsx';
import PermissionWrapper from '../../../components/PermissionWrapper.jsx';
import usePermissions from '../../../hooks/usePermissions.js';


const SubResultManageTab = () => {
  // Permission hook
  const { hasPermission, loading: permissionsLoading } = usePermissions();
  
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
  const [actionType, setActionType] = useState(''); // 'delete' or 'declare'
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
      const response = await subAdminAPI.getAllTeams();
      console.log('Fetched all teams:', response.data); // Debug log

      if (response.data && response.data.teams) {
        setAllTeams(response.data.teams);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      toast.error('Failed to fetch teams data');
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subAdminAPI.getResultsWithTeamAndLeader();
      console.log('Fetched results response:', response.data); // Debug log

      if (response.data && response.data.success) {
        const fetchedResults = response.data.results || [];
        console.log('Fetched results:', fetchedResults); // Debug log

        // Log sample team data to check structure
        if (fetchedResults.length > 0) {
          console.log('Sample result data:', fetchedResults[0]);
          console.log('Team info:', fetchedResults[0].team);
          console.log('Leader info:', fetchedResults[0].leader);
        }

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

  // Download Excel/CSV functionality using fetched data
  const handleDownloadExcel = async () => {
    try {
      setDownloadingExcel(true);

      // Get the combined data (all teams with their results)
      const allTeamsData = combineTeamsWithResults();

      console.log('Export data:', allTeamsData); // Debug log

      // Prepare data for export
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

      console.log('Export data formatted:', exportData); // Debug log

      // Try XLSX first, fallback to CSV
      try {
        if (typeof window.XLSX !== 'undefined') {
          const XLSX = window.XLSX;
          // Create workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(exportData);


          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

          // Generate filename with current date
          const today = new Date().toISOString().slice(0, 10);
          const filename = `hackathon_results_${today}.xlsx`;

          // Download file
          XLSX.writeFile(workbook, filename);

          toast.success(`Excel file downloaded successfully! (${allTeamsData.length} teams)`);
        } else {
          throw new Error('XLSX library not available');
        }
      } catch (xlsxError) {
        console.log('XLSX not available, using CSV export');

        // Fallback to CSV export
        const headers = Object.keys(exportData[0]);
        const csvContent = [
          headers.join(','),
          ...exportData.map(row =>
            headers.map(header => {
              const value = row[header];
              // Escape commas and quotes in CSV
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');

        // Create and download CSV
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
      }
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

      // Get the combined data (all teams with their results)
      const allTeamsData = combineTeamsWithResults();

      console.log('Export data:', allTeamsData); // Debug log

      // Prepare data for export
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

      console.log('Export data formatted:', exportData); // Debug log

      // Try XLSX first, fallback to CSV
      try {
        if (typeof window.XLSX !== 'undefined') {
          const XLSX = window.XLSX;
          // Create workbook and worksheet
          const workbook = XLSX.utils.book_new();
          const worksheet = XLSX.utils.json_to_sheet(exportData);


          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');

          // Generate filename with current date
          const today = new Date().toISOString().slice(0, 10);
          const filename = `hackathon_results_${today}.xlsx`;

          // Download file
          XLSX.writeFile(workbook, filename);

          toast.success(`Excel file downloaded successfully! (${allTeamsData.length} teams)`);
        } else {
          throw new Error('XLSX library not available');
        }
      } catch (xlsxError) {
        console.log('XLSX not available, using CSV export');

        // Fallback to CSV export
        const headers = Object.keys(exportData[0]);
        const csvContent = [
          headers.join(','),
          ...exportData.map(row =>
            headers.map(header => {
              const value = row[header];
              // Escape commas and quotes in CSV
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
              return value;
            }).join(',')
          )
        ].join('\n');

        // Create and download CSV
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
      }
    } catch (err) {
      console.error('Error downloading file:', err);
      toast.error('Failed to download file: ' + err.message);
    } finally {
      setDownloadingExcel(false);
    }
  };

  // delete result
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
      const response = await subAdminAPI.importResultsExcel(file);

      if (response.data && response.data.success) {
        toast.success(`Successfully imported ${response.data.importedCount} results!`);
        fetchResults(); // Refresh the data
      }
    } catch (err) {
      console.error('Error uploading Excel:', err);
      toast.error('Failed to upload Excel file');
    } finally {
      setUploadingExcel(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Combine teams with their results
  const combineTeamsWithResults = () => {
    return allTeams.map(team => {
      // Find corresponding result for this team
      const result = results.find(r => r.teamId === team._id);

      // Find team leader
      const leader = team.members?.find(member => member.role === 'Leader');

      return {
        _id: result?._id || team._id,  // Use result ID if exists, else team ID for new results
        resultId: result?._id,         // Actual result ID for updates
        teamId: team._id,
        team: {
          teamName: team.teamName,
          teamCode: team.teamCode,
        },
        leader: leader ? {
          fullName: leader.fullName,
          GitHubProfile: leader.GitHubProfile
        } : null,
        // Result scores (0 if no result found)
        ui: result?.ui || 0,
        ux: result?.ux || 0,
        presentation: result?.presentation || 0,
        viva: result?.viva || 0,
        overAll: result?.overAll || 0,
        codeQuality: result?.codeQuality || 0,
        obtainedMarks: result?.obtainedMarks.toFixed(2) || 0,
        grade: result?.grade || 'N/A',
        hasResult: !!result
      };
    });
  };

  // Filter and sort combined data
  const allTeamsData = combineTeamsWithResults();

  // Debug logging
  console.log('Current sort:', { sortBy, sortOrder });
  console.log('All teams data sample:', allTeamsData.slice(0, 2));

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

      // Handle different sort criteria
      if (sortBy === 'teamName') {
        aValue = a.team?.teamName || '';
        bValue = b.team?.teamName || '';

        // String comparison for team name
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (sortBy === 'teamCode') {
        aValue = a.team?.teamCode || '';
        bValue = b.team?.teamCode || '';

        // String comparison for team code
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (sortBy === 'leaderName') {
        aValue = a.leader?.fullName || '';
        bValue = b.leader?.fullName || '';

        // String comparison for leader name
        if (sortOrder === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else {
        // Numeric comparison for scores
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

  if (loading || permissionsLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3">
            <FiRefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-lg text-gray-600">
              {permissionsLoading ? 'Loading permissions...' : 'Loading results...'}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has basic permission to view results
  if (!hasPermission('viewResults')) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <div className="text-red-600 text-xl mb-2">Access Denied</div>
          <div className="text-red-500 mb-4">You don't have permission to view results. Contact your administrator for access.</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
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
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <FiAward className="w-8 h-8 text-yellow-500" />
            Result Management
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Sub Admin</span>
          </h2>
          <p className="text-gray-600 mt-1">Manage hackathon results and export data (Sub Admin Access)</p>
        </div>
      </div>



      <div className="flex flex-wrap justify-around gap-3">
        <button
          onClick={fetchAllData}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>

        <PermissionWrapper permission="downloadResultTemplate">
          <button
            onClick={handleDownloadExcel}
            disabled={downloadingExcel || allTeams.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            title={`Download ${allTeams.length} teams data as Excel template`}
          >
            <FiDownload className="w-4 h-4" />
            {downloadingExcel ? 'Downloading...' : "Download Template"}
          </button>
        </PermissionWrapper>

        <PermissionWrapper permission="uploadResults">
          <label className="px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors flex items-center gap-2 cursor-pointer">
            <FiUpload className="w-4 h-4" />
            {uploadingExcel ? 'Uploading...' : 'Upload Results Excel'}
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleUploadExcel}
              className="hidden"
              disabled={uploadingExcel}
            />
          </label>
        </PermissionWrapper>


        <PermissionWrapper permission="downloadResults">
          <button
            onClick={handleDownloadResults}
            disabled={downloadingExcel || allTeams.length === 0}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            title={`Download ${allTeams.length} teams data with results`}
          >
            <FiDownload className="w-4 h-4" />
            {downloadingExcel ? 'Downloading...' : "Download Results"}
          </button>
        </PermissionWrapper>

        <PermissionWrapper permission="deleteAllResults">
          <button
            onClick={handleDeleteAllResults}
            disabled={loading || stats.teamsWithResults === 0}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            title={`Delete all ${stats.teamsWithResults} results`}
          >
            <FiTrash2 className="w-4 h-4" />
            {loading ? 'Deleting...' : `Delete All Results (${stats.teamsWithResults})`}
          </button>
        </PermissionWrapper>

        <PermissionWrapper permission="declareAllResults">
          <button
            onClick={handleDeclareAllResults}
            disabled={loading || stats.teamsWithResults === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            title={`Declare all ${stats.teamsWithResults} results`}
          >
            <FiCheckCircle className="w-4 h-4" />
            {loading ? 'Declaring...' : "Declare All Results"}
          </button>
        </PermissionWrapper>
      </div>

      {/* Search and Filter Controls */}
      <PermissionWrapper permission="searchSortResults">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by team name, team code, or GitHub profile..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
                  console.log('Sort order changed to:', newOrder); // Debug log
                  setSortOrder(newOrder);
                }}
                className={`px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-[80px] ${sortOrder === 'asc' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-orange-50 border-orange-300 text-orange-700'
                  }`}
                title={`Currently sorting ${sortOrder === 'asc' ? 'ascending (A-Z, 0-9)' : 'descending (Z-A, 9-0)'} - Click to change`}
              >
                <FiFilter className="w-4 h-4" />
                <span className="text-lg font-bold">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>
                <span className="text-xs font-medium">
                  {sortOrder === 'asc' ? 'ASC' : 'DESC'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </PermissionWrapper>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {filteredAndSortedResults.length === 0 ? (
          <div className="p-12 text-center">
            <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Results Found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'No results match your search criteria.' : 'No results have been uploaded yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('teamName')}
                  >
                    <div className="flex items-center gap-1">
                      Team Info
                      {sortBy === 'teamName' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GitHub link
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('presentation')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Presentation
                      {sortBy === 'presentation' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('ui')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      UI
                      {sortBy === 'ui' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('ux')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      UX
                      {sortBy === 'ux' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('codeQuality')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Code Quality
                      {sortBy === 'codeQuality' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('viva')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Viva
                      {sortBy === 'viva' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('overAll')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Overall
                      {sortBy === 'overAll' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>

                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('obtainedMarks')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Obtained Marks
                      {sortBy === 'obtainedMarks' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => setSortBy('grade')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Grade
                      {sortBy === 'grade' && (
                        <span className={`text-sm ${sortOrder === 'asc' ? 'text-blue-600' : 'text-orange-600'}`}>
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  {(hasPermission('editResult') || hasPermission('createResult') || hasPermission('deleteResult')) && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {console.log(filteredAndSortedResults)
                }
                {filteredAndSortedResults.map((item, index) => (
                  <tr key={item._id || index} className={`hover:bg-gray-50 transition-colors ${!item.hasResult ? 'bg-yellow-50' : ''}`}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900 flex items-center gap-2">
                          {item.team?.teamName || 'N/A'}
                          {!item.hasResult && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              No Result
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.team?.teamCode || 'No Code'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Leader: {item.leader?.fullName || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiGithub className="w-4 h-4 text-gray-400" />
                        {item.leader?.GitHubProfile ? (
                          <a
                            href={item.leader.GitHubProfile}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm truncate max-w-xs"
                          >
                            Click to Visit
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">No GitHub</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {item.presentation || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {item.ui || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {item.ux || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {item.codeQuality || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        {item.viva || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {item.overAll || 0}
                      </span>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-100 text-pink-800">
                        {item.obtainedMarks || 0}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-fuchsia-100 text-fuchsia-800">
                        {item.grade || 0}
                      </span>
                    </td>

                    {(hasPermission('editResult') || hasPermission('createResult') || hasPermission('deleteResult')) && (
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <PermissionWrapper permission={item.hasResult ? "editResult" : "createResult"}>
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
                          </PermissionWrapper>

                          {item.hasResult && (
                            <PermissionWrapper permission="deleteResult">
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Are you sure you want to delete result for team "${item.team?.teamName}"?`)) {
                                    try {
                                      setLoading(true);
                                      await subAdminAPI.deleteResult(item.resultId);
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
                            </PermissionWrapper>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <PermissionWrapper permission="viewResultStatistics">
        <div className="text-center text-sm text-gray-500">
          Showing {filteredAndSortedResults.length} of {allTeams.length} teams
          ({stats.teamsWithResults} have results)
          {searchTerm && (
            <span className="ml-2">
              (filtered by "{searchTerm}")
            </span>
          )}
        </div>
      </PermissionWrapper>

      {/* Edit Modal */}
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


      {/* Reconfirm Modal */}
      <ReconfirmModal
        showModal={reconfirmModal}
        setShowModal={setReconfirmModal}
        onConfirm={async () => {
          try {
            setLoading(true);
            if (actionType === 'delete') {
              // Call delete API
              await subAdminAPI.deleteAllResults();
              toast.success('Result deleted successfully!');
            } else if (actionType === 'declare') {
              // Call declare API
              await subAdminAPI.declareAllResults();
              toast.success('Result declared successfully!');
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

export default SubResultManageTab;
