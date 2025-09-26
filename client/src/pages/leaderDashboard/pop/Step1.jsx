import React, { useEffect } from 'react';
import { User, Mail, Phone, Github, School, BookOpen, GitBranch, Calendar } from 'lucide-react';

const Step1 = ({ data, onChange, fetchLeader }) => {
  useEffect(() => {
    // Fetch leader profile if not already loaded
    if (fetchLeader) {
      fetchLeader();
    }
  }, [fetchLeader]);

  return (
    <div className="bg-white max-w-4xl w-full mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Personal Information
          </h4>
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              value={data.fullName || ''}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
              placeholder="Enter full name"
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="email"
                name="email"
                value={data.email || ''}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="Enter email address"
              />
            </div>
          </div>
          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="tel"
                name="phone"
                value={data.phone || ''}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="Enter phone number"
                maxLength="10"
              />
            </div>
          </div>
          {/* GitHub Profile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile<span className="text-red-500">*</span></label>
            <div className="relative">
              <Github className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="url"
                name="GitHubProfile"
                value={data.GitHubProfile || ''}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>
        {/* Academic Information */}
        <div className="space-y-6">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <School className="w-4 h-4" />
            Academic Information
          </h4>
          {/* College Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College Name<span className="text-red-500">*</span></label>
            <input
              type="text"
              name="collegeName"
              value={data.collegeName || ''}
              onChange={onChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
              placeholder="Enter college name"
            />
          </div>
          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Course<span className="text-red-500">*</span></label>
            <div className="relative">
              <BookOpen className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="course"
                value={data.course || ''}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="Enter your course"
              />
            </div>
          </div>
          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Branch<span className="text-red-500">*</span></label>
            <div className="relative">
              <GitBranch className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="collegeBranch"
                value={data.collegeBranch || ''}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="Enter your branch"
              />
            </div>
          </div>
          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester<span className="text-red-500">*</span></label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="collegeSemester"
                value={data.collegeSemester || ''}
                onChange={onChange}
                required
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="Enter your semester"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1;
