import React from 'react';
import { 
  X, 
  Trash2, 
  User, 
  Mail, 
  Phone,
  UserMinus,
  Shield
} from 'lucide-react';

const DeleteMember = ({ 
  isOpen, 
  member, 
  onConfirm, 
  onCancel, 
  loading = false 
}) => {
  if (!isOpen || !member) return null;

  const handleConfirmDelete = () => {
    onConfirm(member);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-500 to-red-600 text-white sticky top-0 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white bg-opacity-20 text-red-500">
                <UserMinus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Remove Team Member</h2>
                <p className="text-red-100 text-sm">This action cannot be undone</p>
              </div>
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors disabled:opacity-50"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Member Information Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Member Details
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-blue-400 to-blue-600">
                  {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'M'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">{member.fullName}</p>
                  <p className="text-sm text-gray-600">{member.role || 'Team Member'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2 mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-3 h-3" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-3 h-3" />
                  {member.phone}
                </div>
                {member.collegeName && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-3 h-3" />
                    {member.collegeName}
                  </div>
                )}
                {member.course && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-3 h-3" />
                    {member.course} - {member.collegeBranch}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Consequences */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-yellow-800 mb-2">What happens when you remove this member:</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• They will lose access to team resources and communications</li>
              <li>• Their registration for this hackathon team will be cancelled</li>
              <li>• They will need to register again if they want to rejoin</li>
              <li>• Team size will be reduced by one member</li>
            </ul>
          </div>

          {/* Confirm and Cancel Buttons */}
          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={loading}
              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Removing...' : 'Remove Member'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteMember;