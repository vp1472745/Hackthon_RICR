// Step1.jsx
import React, { useEffect, useState } from 'react';
import {
  User,
  Github,
  School,
  BookOpen,
  GitBranch,
  Calendar,
  Loader
} from 'lucide-react';
import { IoIosSave } from "react-icons/io";
import { userAPI } from '../../../configs/api.js'; // ensure path is correct
import { toast } from 'react-toastify';

const Step1 = ({ setIsStep1Saved }) => {
  const [leader, setLeader] = useState(null);
  const [formData, setFormData] = useState({});

  // Added validation to disable Save button if required fields are empty
  const isFormValid = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'collegeName', 'course', 'collegeBranch', 'collegeSemester'];
    return requiredFields.every((field) => formData[field] && formData[field] !== 'N/A' && formData[field] !== '0');
  };

  useEffect(() => {
    let mounted = true;

    const fetchLeader = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        // token fallback: localStorage -> url param
        let token = localStorage.getItem('authToken');
        if (!token) {
          const params = new URLSearchParams(window.location.search);
          token = params.get('token');
          if (token) localStorage.setItem('authToken', token);
        }

        if (!token) {
          if (mounted) {
            setLeader(null);
            setErrorMsg('No auth token found.');
            setLoading(false);
          }
          return;
        }

        // call axios wrapper from configs/api.js
        const res = await userAPI.getLeaderProfile();
        const data = res?.data ?? null;

        if (data && data.leader) {
          const { leader, team } = data;
          setLeader(leader);
          setFormData({ ...leader, team });
        } else {
          setLeader(null);
          setErrorMsg('Failed to fetch leader profile.');
        }
      } catch (err) {
        console.error('Failed to fetch leader profile:', err);
        if (mounted) {
          // attempt to parse axios error message
          const msg = err?.response?.data?.message || err.message || 'Failed to fetch profile';
          setErrorMsg(msg);
          setLeader(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLeader();

    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let token = localStorage.getItem('authToken');
      if (!token) {
        setErrorMsg('No auth token found.');
        setLoading(false);
        return;
      }

      const updatedLeader = await userAPI.updateLeaderProfile(formData);
      toast.success(updatedLeader.data.message);

      setLeader(updatedLeader);
      setIsStep1Saved(true); // Notify MultiStepModal that Step1 is saved
    } catch (error) {
      console.error('Failed to update leader profile:', error);
      setErrorMsg('Failed to update leader profile.');
    } finally {
      setLoading(false);
    }
  };



  if (!leader) {
    return (
      <div className="text-center py-12 text-red-500">Leader profile not found.</div>
    );
  }

  return (
    <div className="bg-white max-w-4xl w-full mx-auto p-2">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Information */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <User className="w-4 h-4" />
            Personal Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              GitHub Profile (optional)
            </label>
            <div className="relative">
              <Github className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="url"
                name="GitHubProfile"
                value={formData.GitHubProfile || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>

        {/* Academic Information */}
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
            <School className="w-4 h-4" />
            Academic Information
          </h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select
                name="course"
                value={formData.course || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
              >
                <option value="N/A">Select Course</option>
                <option value="B.Tech">B.Tech (Bachelor of Technology)</option>
                <option value="B.E">B.E (Bachelor of Engineering)</option>
                <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                <option value="MCA">MCA (Master of Computer Applications)</option>
                <option value="M.Tech">M.Tech (Master of Technology)</option>
                <option value="M.E">M.E (Master of Engineering)</option>
                <option value="B.Sc">B.Sc (Bachelor of Science)</option>
                <option value="M.Sc">M.Sc (Master of Science)</option>
                <option value="BBA">BBA (Bachelor of Business Administration)</option>
                <option value="MBA">MBA (Master of Business Administration)</option>
                <option value="B.Com">B.Com (Bachelor of Commerce)</option>
                <option value="M.Com">M.Com (Master of Commerce)</option>
                <option value="Diploma">Diploma</option>
                <option value="Ph.D">Ph.D (Doctor of Philosophy)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <GitBranch className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select
                name="collegeBranch"
                value={formData.collegeBranch || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
              >
                <option value="N/A">Select Branch</option>
                <option value="Computer Science Engineering">Computer Science Engineering (CSE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Electronics and Communication">Electronics and Communication (ECE)</option>
                <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                <option value="Civil Engineering">Civil Engineering (CE)</option>
                <option value="Chemical Engineering">Chemical Engineering (ChE)</option>
                <option value="Aerospace Engineering">Aerospace Engineering (AE)</option>
                <option value="Biotechnology">Biotechnology (BT)</option>
                <option value="Automobile Engineering">Automobile Engineering (Auto)</option>
                <option value="Production Engineering">Production Engineering (PE)</option>
                <option value="Industrial Engineering">Industrial Engineering (IE)</option>
                <option value="Software Engineering">Software Engineering (SE)</option>
                <option value="Data Science">Data Science (DS)</option>
                <option value="Artificial Intelligence">Artificial Intelligence (AI)</option>
                <option value="Machine Learning">Machine Learning (ML)</option>
                <option value="Cyber Security">Cyber Security (CS)</option>
                <option value="Commerce">Commerce</option>
                <option value="Management">Management</option>
                <option value="Arts">Arts</option>
                <option value="Science">Science</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select
                name="collegeSemester"
                value={formData.collegeSemester || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
              >
                <option value="0">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
                <option value="pass">Pass out</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={handleSave}
          disabled={!isFormValid()} // Disable Save button if form is invalid
          className={`px-10 py-2 rounded flex items-center gap-2 ${isFormValid() ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <IoIosSave className='text-xl' /> Save
        </button>
      </div>
    </div>
  );
};

export default Step1;
