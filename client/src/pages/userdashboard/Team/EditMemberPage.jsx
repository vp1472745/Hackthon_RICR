import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  Crown,
  Shield,
  Search,
  ChevronDown
} from 'lucide-react';

const EditMemberPage = ({
  member,
  onSave,
  onCancel
}) => {
  const [formData, setFormData] = useState(member || {
    fullName: '',
    email: '',
    phone: '',
    collegeName: '',
    semester: '',
    course: '',
    stream: '',
    role: 'Member'
  });

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

  const [errors, setErrors] = useState({});

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

  const semesters = [
    '1st Semester', '2nd Semester', '3rd Semester', '4th Semester',
    '5th Semester', '6th Semester', '7th Semester', '8th Semester',
    '1st Year', '2nd Year', '3rd Year', '4th Year',
    '11th Grade', '12th Grade'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.collegeName?.trim()) {
      newErrors.collegeName = 'College/School name is required';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave?.(formData);
    }
  };

  const filteredCourses = courses.filter(course =>
    course.toLowerCase().includes(searchTerms.course.toLowerCase())
  );

  const filteredStreams = streams.filter(stream =>
    stream.toLowerCase().includes(searchTerms.stream.toLowerCase())
  );

  useEffect(() => {
    if (member) {
      setFormData(member);
    }
  }, [member]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // if click outside any dropdown-container, close all
      if (!event.target.closest('.dropdown-container')) {
        setDropdownStates({
          course: false,
          stream: false,
          role: false,
          semester: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-xl mx-auto w-full"> {/* Compact width */}
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-slate-200/60 h-auto min-h-[140px]">
          <div className="flex items-center space-x-4">
            <button
              onClick={onCancel}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={22} className="text-slate-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0B2A4A] to-[#1D5B9B] rounded-full flex items-center justify-center text-white font-bold">
                {formData.fullName?.charAt(0)?.toUpperCase() || 'M'}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Edit Team Member</h1>
                <p className="text-sm text-slate-600">Update member information and details</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form (compact card) */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200/60 h-auto min-h-[500px] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
                <User size={18} />
                <span>Personal Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.fullName || ''}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all ${errors.fullName ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Enter full name"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="Enter email address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all ${errors.phone ? 'border-red-500' : 'border-slate-300'}`}
                      placeholder="Enter phone number"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                {/* Role Dropdown */}
                <div className="relative dropdown-container">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('role')}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between ${errors.role ? 'border-red-500' : 'border-slate-300'}`}
                  >
                    <div className="flex items-center space-x-2">
                      {formData.role === 'Leader' ? (
                        <Crown size={14} className="text-yellow-500" />
                      ) : (
                        <Shield size={14} className="text-blue-500" />
                      )}
                      <span className={formData.role ? 'text-slate-900' : 'text-slate-500'}>
                        {formData.role || 'Select role'}
                      </span>
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${dropdownStates.role ? 'rotate-180' : ''}`} />
                  </button>
                  {errors.role && (
                    <p className="text-red-500 text-xs mt-1">{errors.role}</p>
                  )}
                  {dropdownStates.role && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg">
                      {roles.map((role) => {
                        const IconComponent = role.icon;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => selectOption('role', role.value)}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <IconComponent size={14} className={role.value === 'Leader' ? 'text-yellow-500' : 'text-blue-500'} />
                            <span>{role.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center space-x-2 border-b border-slate-200 pb-3">
                <GraduationCap size={18} />
                <span>Academic Information</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    College/School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.collegeName || ''}
                    onChange={(e) => handleInputChange('collegeName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all ${errors.collegeName ? 'border-red-500' : 'border-slate-300'}`}
                    placeholder="Enter college or school name"
                  />
                  {errors.collegeName && (
                    <p className="text-red-500 text-xs mt-1">{errors.collegeName}</p>
                  )}
                </div>

                {/* Semester Dropdown */}
                <div className="relative dropdown-container">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Semester/Class
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('semester')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                  >
                    <span className={formData.semester ? 'text-slate-900' : 'text-slate-500'}>
                      {formData.semester || 'Select semester/class'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${dropdownStates.semester ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownStates.semester && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg max-h-44 overflow-y-auto">
                      {semesters.map((semester) => (
                        <button
                          key={semester}
                          type="button"
                          onClick={() => selectOption('semester', semester)}
                          className="w-full px-3 py-2 text-left hover:bg-slate-50"
                        >
                          {semester}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Course Dropdown */}
                <div className="relative dropdown-container">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Course
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('course')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                  >
                    <span className={formData.course ? 'text-slate-900' : 'text-slate-500'}>
                      {formData.course || 'Select course'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${dropdownStates.course ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownStates.course && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg">
                      <div className="p-2 border-b border-slate-200">
                        <div className="relative">
                          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchTerms.course}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, course: e.target.value }))}
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {filteredCourses.map((course) => (
                          <button
                            key={course}
                            type="button"
                            onClick={() => selectOption('course', course)}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50"
                          >
                            {course}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Stream Dropdown */}
                <div className="relative md:col-span-2 dropdown-container">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Stream/Specialization
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleDropdown('stream')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent transition-all text-left flex items-center justify-between"
                  >
                    <span className={formData.stream ? 'text-slate-900' : 'text-slate-500'}>
                      {formData.stream || 'Select stream'}
                    </span>
                    <ChevronDown size={16} className={`transition-transform ${dropdownStates.stream ? 'rotate-180' : ''}`} />
                  </button>
                  {dropdownStates.stream && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-md shadow-lg">
                      <div className="p-2 border-b border-slate-200">
                        <div className="relative">
                          <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            placeholder="Search streams..."
                            value={searchTerms.stream}
                            onChange={(e) => setSearchTerms(prev => ({ ...prev, stream: e.target.value }))}
                            className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                          />
                        </div>
                      </div>
                      <div className="max-h-44 overflow-y-auto">
                        {filteredStreams.map((stream) => (
                          <button
                            key={stream}
                            type="button"
                            onClick={() => selectOption('stream', stream)}
                            className="w-full px-3 py-2 text-left hover:bg-slate-50"
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

          {/* Action Buttons (sticky bottom on small screens) */}
          <div className="p-4 border-t border-slate-200 flex space-x-3 sticky bottom-0 bg-white">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors text-sm font-medium"
            >
              Cancel Changes
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0B2A4A] to-[#1D5B9B] text-white rounded-md hover:shadow-md transition-all text-sm font-medium flex items-center justify-center gap-2"
            >
              <Save size={14} />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMemberPage;
