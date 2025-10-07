import React, { useState, useEffect } from 'react';
import { 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  School, 
  BookOpen, 
  GitBranch,
  Calendar,
  Github,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const EditMember = ({ 
  isOpen, 
  member, 
  onSave, 
  onCancel, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    collegeName: '',
    course: '',
    collegeBranch: '',
    collegeSemester: '',
    GitHubProfile: ''
  });

  const [errors, setErrors] = useState({});
  const [isModified, setIsModified] = useState(false);

  // Course options - expanded to match more variations
  const courseOptions = [
    'N/A',
    'B.Tech',
    'B.E',
    'BCA',
    'MCA', 
    'M.Tech',
    'M.E',
    'B.Sc',
    'M.Sc',
    'BSc IT', 
    'MSc IT', 
    'BSc Computer Science', 
    'MSc Computer Science',
    'B.Com',
    'M.Com', 
    'BBA',
    'MBA',
    'Diploma',
    'Ph.D',
    'B.Tech (Bachelor of Technology)',
    'B.E (Bachelor of Engineering)',
    'BCA (Bachelor of Computer Applications)',
    'MCA (Master of Computer Applications)',
    'M.Tech (Master of Technology)',
    'M.E (Master of Engineering)',
    'B.Sc (Bachelor of Science)',
    'M.Sc (Master of Science)',
    'BBA (Bachelor of Business Administration)',
    'MBA (Master of Business Administration)',
    'B.Com (Bachelor of Commerce)',
    'M.Com (Master of Commerce)',
    'Ph.D (Doctor of Philosophy)',
    'Sample Course'
  ];

  // Branch options - expanded to match more variations
  const branchOptions = [
    'N/A',
    'Computer Science Engineering',
    'Computer Science Engineering (CSE)',
    'Information Technology',
    'Information Technology (IT)',
    'Electronics and Communication',
    'Electronics & Communication',
    'Electronics and Communication (ECE)',
    'Electrical Engineering',
    'Electrical Engineering (EE)',
    'Mechanical Engineering',
    'Mechanical Engineering (ME)',
    'Civil Engineering',
    'Civil Engineering (CE)',
    'Chemical Engineering',
    'Chemical Engineering (ChE)',
    'Aerospace Engineering',
    'Aerospace Engineering (AE)',
    'Biomedical Engineering',
    'Software Engineering',
    'Software Engineering (SE)',
    'Data Science',
    'Data Science (DS)',
    'Artificial Intelligence',
    'Artificial Intelligence (AI)',
    'Machine Learning',
    'Machine Learning (ML)',
    'Cyber Security',
    'Cyber Security (CS)',
    'Web Development',
    'Biotechnology',
    'Biotechnology (BT)',
    'Automobile Engineering',
    'Automobile Engineering (Auto)',
    'Production Engineering',
    'Production Engineering (PE)',
    'Industrial Engineering',
    'Industrial Engineering (IE)',
    'Commerce',
    'Management',
    'Arts',
    'Science',
    'Sample Branch',
    'Other'
  ];

  // Semester options - expanded to handle different formats
  const semesterOptions = [
    { value: '0', label: 'Select Semester' },
    { value: '1', label: '1st Semester' },
    { value: '2', label: '2nd Semester' },
    { value: '3', label: '3rd Semester' },
    { value: '4', label: '4th Semester' },
    { value: '5', label: '5th Semester' },
    { value: '6', label: '6th Semester' },
    { value: '7', label: '7th Semester' },
    { value: '8', label: '8th Semester' },
    { value: '9', label: 'Pass out' }
  ];

  useEffect(() => {
    if (member && Object.keys(member).length > 0) {
      console.log("EditMember - Received member data:", member);
      console.log("EditMember - Member keys:", Object.keys(member));
      
      // Handle different possible data structures
      const memberData = member.user || member.member || member;
      
      // Enhanced data extraction with better handling
      const course = memberData.course || '';
      const branch = memberData.collegeBranch || memberData.branch || '';
      const semester = memberData.collegeSemester ? memberData.collegeSemester.toString() : '';
      
      console.log("EditMember - Raw course:", course);
      console.log("EditMember - Raw branch:", branch);  
      console.log("EditMember - Raw semester:", semester);
      console.log("EditMember - Available course options:", courseOptions);
      console.log("EditMember - Available branch options:", branchOptions);
      
      const newFormData = {
        fullName: memberData.fullName || memberData.name || '',
        email: memberData.email || '',
        phone: memberData.phone || memberData.phoneNumber || '',
        city: memberData.city || '',
        state: memberData.state || '',
        collegeName: memberData.collegeName || memberData.college || '',
        course: course,
        collegeBranch: branch,
        collegeSemester: semester,
        GitHubProfile: memberData.GitHubProfile || memberData.github || ''
      };
      
      console.log("EditMember - Processed member data:", memberData);
      console.log("EditMember - Setting form data:", newFormData);
      setFormData(newFormData);
      setErrors({});
      setIsModified(false);
    } else {
      console.log("EditMember - No valid member data received:", member);
    }
  }, [member]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setIsModified(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required';
    }

    if (!formData.course) {
      newErrors.course = 'Course selection is required';
    }

    if (!formData.collegeBranch) {
      newErrors.collegeBranch = 'Branch selection is required';
    }

    if (!formData.collegeSemester) {
      newErrors.collegeSemester = 'Semester selection is required';
    }

    if (formData.GitHubProfile && !formData.GitHubProfile.includes('github.com')) {
      newErrors.GitHubProfile = 'Please enter a valid GitHub profile URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    onSave(formData);
  };

  const handleCancel = () => {
    if (isModified) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <p className="font-medium">Unsaved Changes</p>
            <p className="text-sm text-gray-600">You have unsaved changes. Are you sure you want to cancel?</p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onCancel();
                }}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
              >
                Yes, Cancel
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        ),
        {
          duration: Infinity,
          position: "top-center",
          style: {
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e'
          }
        }
      );
    } else {
      onCancel();
    }
  };

  if (!isOpen) {
    return null;
  }

  if (!member || Object.keys(member).length === 0) {
    console.log("EditMember - No valid member data provided:", member);
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 md:p-4">
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-5 h-5" />
            <div>
              <p className="font-medium">No member data available</p>
              <p className="text-sm text-gray-600 mt-1">
                {!member ? "Member object is null/undefined" : "Member object is empty"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Received: {JSON.stringify(member)}
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl shadow-xl w-full max-w-2xl lg:max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-[#0B2A4A] to-[#1e3a5f] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-black font-bold text-lg md:text-xl bg-white bg-opacity-20">
                {member.fullName ? member.fullName.charAt(0).toUpperCase() : 'M'}
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold">Edit Team Member</h2>
                <p className="text-blue-100 text-sm">Update {member.fullName}'s information</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 md:p-2 hover:bg-white hover:text-black hover:bg-opacity-20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Personal Information */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                <User className="w-4 h-4" />
                Personal Information
              </h4>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter phone number"
                    maxLength="10"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter city"
                  />
                </div>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.city}
                  </p>
                )}
              </div>

              {/* GitHub Profile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Profile
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="url"
                    value={formData.GitHubProfile}
                    onChange={(e) => handleInputChange('GitHubProfile', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm ${
                      errors.GitHubProfile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://github.com/username"
                  />
                </div>
                {errors.GitHubProfile && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.GitHubProfile}
                  </p>
                )}
              </div>
            </div>

            {/* Academic Information */}
            <div className="space-y-3 md:space-y-4">
              <h4 className="font-semibold text-gray-800 flex items-center gap-2 text-sm md:text-base">
                <School className="w-4 h-4" />
                Academic Information
              </h4>

              {/* College Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Name *
                </label>
                <input
                  type="text"
                  value={formData.collegeName}
                  onChange={(e) => handleInputChange('collegeName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm ${
                    errors.collegeName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter college name"
                />
                {errors.collegeName && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.collegeName}
                  </p>
                )}
              </div>

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course *
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
                  <select
                    value={formData.course}
                    onChange={(e) => handleInputChange('course', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm appearance-none bg-white ${
                      errors.course ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Course</option>
                    {courseOptions.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
                {errors.course && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.course}
                  </p>
                )}
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Branch *
                </label>
                <div className="relative">
                  <GitBranch className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
                  <select
                    value={formData.collegeBranch}
                    onChange={(e) => handleInputChange('collegeBranch', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm appearance-none bg-white ${
                      errors.collegeBranch ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select Branch</option>
                    {branchOptions.map(branch => (
                      <option key={branch} value={branch}>{branch}</option>
                    ))}
                  </select>
                </div>
                {errors.collegeBranch && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.collegeBranch}
                  </p>
                )}
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Semester *
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
                  <select
                    value={formData.collegeSemester}
                    onChange={(e) => handleInputChange('collegeSemester', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm appearance-none bg-white ${
                      errors.collegeSemester ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    {semesterOptions.map(sem => (
                      <option key={sem.value} value={sem.value}>{sem.label}</option>
                    ))}
                  </select>
                </div>
                {errors.collegeSemester && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.collegeSemester}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400 z-10" />
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm appearance-none bg-white ${
                      errors.state ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select State</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
                    <option value="Goa">Goa</option>
                    <option value="Gujarat">Gujarat</option>
                    <option value="Haryana">Haryana</option>
                    <option value="Himachal Pradesh">Himachal Pradesh</option>
                    <option value="Jharkhand">Jharkhand</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Manipur">Manipur</option>
                    <option value="Meghalaya">Meghalaya</option>
                    <option value="Mizoram">Mizoram</option>
                    <option value="Nagaland">Nagaland</option>
                    <option value="Odisha">Odisha</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Sikkim">Sikkim</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Tripura">Tripura</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Uttarakhand">Uttarakhand</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                    <option value="Ladakh">Ladakh</option>
                    <option value="Lakshadweep">Lakshadweep</option>
                    <option value="Puducherry">Puducherry</option>
                  </select>
                </div>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.state}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Save Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="px-4 md:px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm md:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !isModified}
              className="px-4 md:px-6 py-2 bg-[#0B2A4A] text-white rounded-lg hover:bg-[#0d2d4f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base order-1 sm:order-2 mb-3 sm:mb-0"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMember;