import React from 'react';
import { FiX } from 'react-icons/fi';
import { resultAPI } from '../../../../configs/api';
import { toast } from 'react-hot-toast';

const EditResultModal = ({
  showModal,
  setShowModal,
  editingResult,
  setEditingResult,
  formData,
  setFormData,
  loading,
  setLoading,
  fetchResults
}) => {

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Clean form data - convert empty strings to 0
      const cleanData = {
        teamId: formData.teamId,
        ui: formData.ui || 0,
        ux: formData.ux || 0,
        presentation: formData.presentation || 0,
        viva: formData.viva || 0,
        overAll: formData.overAll || 0,
        codeQuality: formData.codeQuality || 0
      };

      if (editingResult?.hasResult && editingResult?.resultId) {
        // Update existing result
        await resultAPI.updateResult(editingResult.resultId, cleanData);
        toast.success('Result updated successfully!');
      } else {
        // Create new result
        await resultAPI.createResult(cleanData);
        toast.success('Result created successfully!');
      }

      setShowModal(false);
      setEditingResult(null);
      fetchResults();
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingResult(null);
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingResult?.hasResult ? 'Edit Result' : 'Add Result'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Team: <span className="font-medium">{editingResult?.team?.teamName || 'N/A'}</span>
          </p>
          <p className="text-sm text-gray-600">
            Code: <span className="font-medium">{editingResult?.team?.teamCode || 'N/A'}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Presentation Score (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.presentation || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, presentation: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UI Score (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.ui || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ui: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UX Score (0-10)
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={formData.ux || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, ux: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code Quality Score (0-20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.01"
                value={formData.codeQuality || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, codeQuality: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Viva Score (0-20)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                step="0.01"
                value={formData.viva || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, viva: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overall Score (0-30)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                step="0.01"
                value={formData.overAll || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, overAll: e.target.value ? parseFloat(e.target.value) : '' }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
              />
            </div>


          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingResult?.hasResult ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditResultModal;