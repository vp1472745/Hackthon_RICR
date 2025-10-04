import React, { useState } from 'react';
import { subAdminAPI } from '../../../../configs/api';

const DeletePS = ({ problem, onClose, onPSDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!problem || !problem._id) {
      setError('Problem statement ID is missing. Cannot delete.');
      console.error('DeletePS: problem object is', problem);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await subAdminAPI.deleteProblemStatement(problem._id);
      onPSDeleted();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete problem statement');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-lg text-gray-800 font-semibold">
        {problem && (problem.PStitle || problem.title) ? (
          <>
            Are you sure you want to delete the problem statement{' '}
            <span className="text-red-600">{problem.PStitle || problem.title}</span>?
          </>
        ) : (
          <span className="text-red-600">Problem statement data is missing or invalid.</span>
        )}
        {/* Debug info for developers */}
       
      </div>
      {error && <div className="text-red-600">{error}</div>}
      <div className="flex gap-4 justify-end">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg cursor-pointer bg-gray-200 hover:bg-gray-300">Cancel</button>
        <button type="button" onClick={handleDelete} disabled={loading || !problem || !problem._id} className="px-6 py-2 rounded-lg cursor-pointer  bg-red-600 text-white font-semibold hover:bg-red-700">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div> 
  );
};

export default DeletePS;
