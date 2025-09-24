import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  Save,
  Crown,
  Shield,
  Search,
  ChevronDown
} from 'lucide-react';
import api from '../../../configs/api.js';

const AddMemberModal = ({
  showModal,
  onClose,
  onSave,
  existingMembers = []
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    semester: '',
    course: '',
    stream: '',
    role: 'Member'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Reset form when modal opens
  useEffect(() => {
    if (showModal) {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        collegeName: '',
        semester: '',
        course: '',
        stream: '',
        role: 'Member'
      });
      setError(null);
      setSuccess(null);
    }
  }, [showModal]);

  const [dropdownStates, setDropdownStates] = useState({
    course: false,
    stream: false,
    role: false,
    semester: false
  });

  const [searchTerms, setSearchTerms] = useState({
    course: '',
    stream: ''
  });

  // Dropdown options
  const courses = [
    'B.Tech - Bachelor of Technology',
    'B.E - Bachelor of Engineering',
    'BCA - Bachelor of Computer Applications',
    'MCA - Master of Computer Applications',
    'M.Tech - Master of Technology',
    'B.Sc - Bachelor of Science',
    'M.Sc - Master of Science',
    'BBA - Bachelor of Business Administration',
    'MBA - Master of Business Administration',
    'B.Com - Bachelor of Commerce',
    'M.Com - Master of Commerce',
    'Diploma in Engineering',
    'Polytechnic Diploma',
    '12th Grade - Science',
    '12th Grade - Commerce',
    '11th Grade - Science',
    '11th Grade - Commerce'
  ];

  const streams = [
    'Computer Science Engineering',
    'Information Technology',
    'Software Engineering',
    'Data Science',
    'Artificial Intelligence',
    'Machine Learning',
    'Cyber Security',
    'Electronics Engineering',
    'Electrical Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Commerce',
    'Business Administration',
    'Finance',
    'Marketing',
    'Other'
  ];

  const roles = [
    { value: 'Leader', label: 'Team Leader', icon: Crown },
    { value: 'Member', label: 'Team Member', icon: Shield }
  ];

  // Check if there's already a team leader
  const hasExistingLeader = existingMembers.some(member => 
    member.role === 'Leader'
  );

  const availableRoles = hasExistingLeader
    ? roles.filter(role => role.value === 'Member')
    : roles;

  // Auto-set role to Member if Leader already exists
  useEffect(() => {
    if (hasExistingLeader && formData.role === 'Leader') {
      setFormData(prev => ({ ...prev, role: 'Member' }));
    }
  }, [hasExistingLeader, formData.role]);

  const semesters = [
    '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
    '5th Semester', '6th Semester', '7th Semester', '8th Semester',
    '1st Year', '2nd Year', '3rd Year', '4th Year',
    '11th Grade', '12th Grade'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDropdown = (dropdown) => {
    setDropdownStates(prev => ({
      ...prev,
      [dropdown]: !prev[dropdown]
    }));
  };

  const selectOption = (field, value) => {
    handleInputChange(field, value);
    setDropdownStates(prev => ({ ...prev, [field]: false }));
  };

  const handleSave = async () => {
    // Reset previous states
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.collegeName) {
      setError('Please fill all required fields!');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please provide a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Please provide a valid 10-digit Indian phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Add new member (POST only)
      const response = await api.post('/members/addmember', formData);
      setSuccess('Member added successfully!');
      onSave(response.data.member); // Pass new member data back

      // Close modal after a short delay to show success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('API Error:', error);

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors.join(', '));
      } else {
        setError('Failed to add member. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      collegeName: '',
      semester: '',
      course: '',
      stream: '',
      role: 'Member'
    });
    setError(null);
    setSuccess(null);
    setIsLoading(false);
    onClose();
  };

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerms.course.toLowerCase())
  );

  const filteredStreams = streams.filter(stream =>
    stream.toLowerCase().includes(searchTerms.stream.toLowerCase())
  );

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start sm:items-center justify-center z-[60] p-2 sm:p-4 ml-0 sm:ml-10">
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-1xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto my-2 sm:my-4">
        <div className="sticky top-0 bg-white p-3 sm:p-4 md:p-6 border-b border-slate-200 z-20">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900">
              Add Team Member
            </h2>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              <p className="text-sm font-medium">{success}</p>
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
              <User size={18} className="sm:w-5 sm:h-5" />
              <span>Personal Information</span>
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all"
                  placeholder="Enter email address"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Role Dropdown */}
              <div className="relative sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Role <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('role')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                >
                  <span className={formData.role ? 'text-slate-900' : 'text-slate-500'}>
                    {formData.role || 'Select role'}
                  </span>
                  <ChevronDown size={18} className={`sm:w-5 sm:h-5 transition-transform ${dropdownStates.role ? 'rotate-180' : ''}`} />
                </button>
                {dropdownStates.role && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {availableRoles.map((role) => {
                      const IconComponent = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => selectOption('role', role.value)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-left hover:bg-slate-50 flex items-center space-x-2"
                        >
                          <IconComponent size={14} className={`sm:w-4 sm:h-4 ${role.value === 'Leader' ? 'text-yellow-500' : 'text-blue-500'}`} />
                          <span>{role.label}</span>
                        </button>
                      );
                    })}
                    {hasExistingLeader && (
                      <div className="px-3 sm:px-4 py-2 text-xs text-slate-500 bg-slate-50 border-t">
                        Team Leader already selected. Only Member role available.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex items-center space-x-2">
              <GraduationCap size={18} className="sm:w-5 sm:h-5" />
              <span>Academic Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  College/School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all"
                  placeholder="Enter college or school name"
                />
              </div>

              {/* Semester Dropdown */}
              <div className="relative sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Semester/Class
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('semester')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                >
                  <span className={formData.semester ? 'text-slate-900' : 'text-slate-500'}>
                    {formData.semester || 'Select semester/class'}
                  </span>
                  <ChevronDown size={18} className={`sm:w-5 sm:h-5 transition-transform ${dropdownStates.semester ? 'rotate-180' : ''}`} />
                </button>
                {dropdownStates.semester && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {semesters.map((semester) => (
                      <button
                        key={semester}
                        type="button"
                        onClick={() => selectOption('semester', semester)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-left hover:bg-slate-50"
                      >
                        {semester}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Course Dropdown with Search */}
              <div className="relative sm:col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Course
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('course')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                >
                  <span className={`${formData.course ? 'text-slate-900' : 'text-slate-500'} truncate`}>
                    {formData.course || 'Select course'}
                  </span>
                  <ChevronDown size={18} className={`sm:w-5 sm:h-5 transition-transform flex-shrink-0 ${dropdownStates.course ? 'rotate-180' : ''}`} />
                </button>
                {dropdownStates.course && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-slate-200">
                      <div className="relative">
                        <Search size={14} className="sm:w-4 sm:h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search courses..."
                          value={searchTerms.course}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, course: e.target.value }))}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredCourses.map((course) => (
                        <button
                          key={course}
                          type="button"
                          onClick={() => selectOption('course', course)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-left hover:bg-slate-50"
                        >
                          {course}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Dropdown with Search */}
              <div className="relative sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Stream/Specialization
                </label>
                <button
                  type="button"
                  onClick={() => toggleDropdown('stream')}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                >
                  <span className={`${formData.stream ? 'text-slate-900' : 'text-slate-500'} truncate`}>
                    {formData.stream || 'Select stream'}
                  </span>
                  <ChevronDown size={18} className={`sm:w-5 sm:h-5 transition-transform flex-shrink-0 ${dropdownStates.stream ? 'rotate-180' : ''}`} />
                </button>
                {dropdownStates.stream && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg">
                    <div className="p-2 sm:p-3 border-b border-slate-200">
                      <div className="relative">
                        <Search size={14} className="sm:w-4 sm:h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search streams..."
                          value={searchTerms.stream}
                          onChange={(e) => setSearchTerms(prev => ({ ...prev, stream: e.target.value }))}
                          className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {filteredStreams.map((stream) => (
                        <button
                          key={stream}
                          type="button"
                          onClick={() => selectOption('stream', stream)}
                          className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-left hover:bg-slate-50"
                        >
                          {stream}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-200 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={`w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm sm:text-base transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'
              }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`w-full sm:flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium flex items-center justify-center space-x-2 text-sm sm:text-base transition-all ${isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white hover:shadow-lg'
              }`}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} className="sm:w-4 sm:h-4" />
                <span>Add Member</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;