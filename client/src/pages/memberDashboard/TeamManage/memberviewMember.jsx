import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  User, 
  GraduationCap, 
  BookOpen, 
  Calendar, 
  Github, 
  School,
  Users,
  Clock
} from 'lucide-react';

const ViewMember = ({ 
  isOpen, 
  member, 
  onClose 
}) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-[#0B2A4A] to-[#1e3a5f] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-black font-bold text-2xl bg-white bg-opacity-20">
                {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{member.fullName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-1 bg-white bg-opacity-20 text-black text-sm font-medium rounded-full">
                    {member.role || 'Team Member'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:text-black hover:bg-opacity-20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Personal Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium text-gray-800">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium text-gray-800">{member.phone}</p>
                  </div>
                </div>

                {member.city && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">City</p>
                      <p className="font-medium text-gray-800">{member.city}</p>
                    </div>
                  </div>
                )}

                {member.state && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">State</p>
                      <p className="font-medium text-gray-800">{member.state}</p>
                    </div>
                  </div>
                )}

                {member.GitHubProfile && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Github className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GitHub Profile</p>
                      <a 
                        href={member.GitHubProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="font-medium text-[#0B2A4A] hover:underline break-all"
                      >
                        {member.GitHubProfile}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Academic Information
              </h3>
              
              <div className="space-y-3">
                {member.collegeName && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <School className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">College Name</p>
                      <p className="font-medium text-gray-800">{member.collegeName}</p>
                    </div>
                  </div>
                )}

                {member.course && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Course</p>
                      <p className="font-medium text-gray-800">{member.course}</p>
                    </div>
                  </div>
                )}

                {member.collegeBranch && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Branch</p>
                      <p className="font-medium text-gray-800">{member.collegeBranch}</p>
                    </div>
                  </div>
                )}

                {member.collegeSemester && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Semester</p>
                      <p className="font-medium text-gray-800">{member.collegeSemester}st Semester</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

         
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMember;