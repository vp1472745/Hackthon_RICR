import React from 'react';
import {
  X,
  Trash2,
  AlertTriangle,
  User
} from 'lucide-react';

const DeleteConfirmation = ({ 
  showModal, 
  onClose, 
  onConfirm, 
  memberName 
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-start sm:items-center justify-center z-[99999] p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md max-h-[95vh] overflow-y-auto my-2 sm:my-4 ml-0 sm:ml-16 md:ml-0 relative z-[99999]">
        <div className="sticky top-0 bg-white p-3 sm:p-4 md:p-6 border-b border-slate-200 z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center space-x-2">
              <AlertTriangle size={20} className="sm:w-6 sm:h-6 text-red-500" />
              <span>Delete Team Member</span>
            </h2>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <User size={24} className="sm:w-8 sm:h-8 text-red-600" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2">
              Are you sure you want to remove this member?
            </h3>
            <p className="text-sm sm:text-base text-slate-600 px-2">
              You are about to remove <span className="font-semibold text-slate-900">"{memberName}"</span> from your team. 
              This action cannot be undone.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <AlertTriangle size={18} className="sm:w-5 sm:h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 mb-1 text-sm sm:text-base">Warning</h4>
                <p className="text-xs sm:text-sm text-red-700">
                  Removing this member will permanently delete their information from your team. 
                  You'll need to re-add them if you want them back on the team.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white p-3 sm:p-4 md:p-6 border-t border-slate-200 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Trash2 size={14} className="sm:w-4 sm:h-4" />
            <span>Delete Member</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;