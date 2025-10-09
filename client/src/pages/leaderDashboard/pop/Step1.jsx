// Step1.jsx
import React, { useEffect, useState } from 'react';
import {
  User,
  Github,
  School,
  BookOpen,
  GitBranch,
  Calendar,
  MapPin,
  Globe,
  Loader as LucideLoader
} from 'lucide-react';
import { userAPI } from '../../../configs/api.js';
import { toast } from 'react-hot-toast';

const Step1 = ({ setIsStep1Saved, setStep }) => {
  const [leader, setLeader] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    GitHubProfile: '',
    collegeName: '',
    course: 'N/A',
    collegeBranch: 'N/A',
    collegeSemester: '0',
    city: '',
    state: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Validate GitHub profile URL: must start with https://github.com/ and have a username after
  const isValidGithubUrl = (url) => {
    if (!url) return false;
    // Must start with https://github.com/ and have at least one character after
    const pattern = /^https:\/\/github\.com\/[A-Za-z0-9_-]+(\/?)*$/;
    return pattern.test(url.trim());
  };

  const isFormValid = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'collegeName', 'course', 'collegeBranch', 'collegeSemester', 'GitHubProfile', 'city', 'state'];
    const allFilled = requiredFields.every((field) => {
      const v = formData[field];
      return v !== undefined && v !== null && v !== '' && v !== 'N/A' && v !== '0';
    });
    // Add GitHub URL validation
    if (!isValidGithubUrl(formData.GitHubProfile)) return false;
    return allFilled;
  };

  // Utility: try to extract userId from multiple sessionStorage shapes
  const getUserIdFromSessionStorage = () => {
    try {
      // 1) hackathonUser (your Overview uses this)
      const hackathonUserStr = sessionStorage.getItem('hackathonUser');
      if (hackathonUserStr) {
        const hackathonUser = JSON.parse(hackathonUserStr);
        if (hackathonUser?.user?._id) return hackathonUser.user._id;
        if (hackathonUser?.user?.id) return hackathonUser.user.id;
      }

      // 2) direct userId key
      const userIdDirect = sessionStorage.getItem('userId');
      if (userIdDirect) return userIdDirect;

      // 3) user (stringified user object)
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        if (userObj?._id) return userObj._id;
        if (userObj?.id) return userObj.id;
      }

      return null;
    } catch (err) {
      console.error('Parsing sessionStorage error:', err);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchLeaderProfileById = async (userId) => {
      try {
        setLoading(true);
        setErrorMsg('');

        if (!userId) {
          setErrorMsg('User ID not found in sessionStorage.');
          return;
        }

        // Adjust endpoint call according to your userAPI implementation.
        // If userAPI.get(`/leader/${userId}`) is correct, use that; below we try common variants.
        let response;
        try {
          response = await userAPI.get(`/leader/${userId}`);
        } catch (e) {
          // fallback: maybe you have getUserById function on userAPI (as in Overview)
          try {
            response = await userAPI.getUserById(userId);
          } catch (e2) {
            console.error('Both /leader/:id and getUserById failed:', e, e2);
            throw e2 || e;
          }
        }

        const payload = response?.data?.data ?? response?.data ?? null;
        if (!payload) {
          setErrorMsg('Leader profile not found in API response.');
          return;
        }

        if (mounted) {
          // If payload has nested `user`, unwrap it
          const userObj = payload.user ?? payload;
          setLeader(userObj);
          setFormData((prev) => ({
            ...prev,
            fullName: userObj.fullName ?? userObj.name ?? prev.fullName,
            email: userObj.email ?? prev.email,
            phone: userObj.phone ?? prev.phone,
            GitHubProfile: userObj.GitHubProfile ?? userObj.github ?? prev.GitHubProfile,
            collegeName: userObj.collegeName ?? prev.collegeName,
            course: userObj.course ?? prev.course,
            collegeBranch: userObj.collegeBranch ?? prev.collegeBranch,
            collegeSemester: userObj.collegeSemester ?? prev.collegeSemester,
            city: userObj.city ?? prev.city,
            state: userObj.state ?? prev.state,
          }));
        }
      } catch (err) {
        console.error('Error fetching leader profile:', err);
        setErrorMsg('Failed to fetch leader profile. Using offline/local data if available.');
        // try fallback to a stored leaderProfile in sessionStorage
        try {
          const stored = sessionStorage.getItem('leaderProfile');
          if (stored) {
            const p = JSON.parse(stored);
            if (mounted) {
              setLeader(p);
              setFormData((prev) => ({ ...prev, ...p }));
            }
          }
        } catch (parseErr) {
          console.error('Fallback parse error:', parseErr);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const userId = getUserIdFromSessionStorage();
    if (userId) {
      fetchLeaderProfileById(userId);
    } else {
      // no id found — allow user to fill form manually (not fatal)
      setLoading(false);
      setErrorMsg('User ID not found in sessionStorage (checked hackathonUser, userId, user, auth). You can still fill the form and save.');
    }

    return () => {
      mounted = false;
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async () => {
    setErrorMsg('');
    if (!isFormValid()) {
      if (!isValidGithubUrl(formData.GitHubProfile)) {
        setErrorMsg('GitHub profile must start with https://github.com/ and include your username.');
        toast.error('Please enter a valid GitHub profile URL.');
      } else {
        toast.error('Please fill all required fields before proceeding.');
      }
      return;
    }

    try {
      setSaving(true);
      const userId = getUserIdFromSessionStorage();

      if (!userId) {
        console.error('User ID is missing. Cannot save leader profile.');
        setErrorMsg('User ID not found.');
        return;
      }

      // Automatically save the form data when moving to the next step
      const response = await userAPI.editMember(userId, formData);
      const payload = response?.data?.data ?? response?.data ?? null;

      if (response.status >= 200 && response.status < 300) {
        setLeader(payload ?? formData);
        sessionStorage.setItem('leaderProfile', JSON.stringify(payload ?? formData));
        toast.success('Profile saved successfully.');
        if (typeof setIsStep1Saved === 'function') setIsStep1Saved(true);

        // Navigate to the next step
        if (typeof setStep === 'function') setStep((prevStep) => prevStep + 1);
      } else {
        console.warn('Save response not OK:', response);
        toast.error('Failed to save profile (server responded with non-2xx).');
      }
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Error while saving profile. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LucideLoader className="animate-spin w-6 h-6 mr-2" />
        <span>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-4xl w-full mx-auto p-2">
      {errorMsg && (
        <div className="text-center py-2 text-yellow-700">
          {errorMsg}
        </div>
      )}

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
              GitHub Profile<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Github className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="url"
                name="GitHubProfile"
                value={formData.GitHubProfile || ''}
                required
                onChange={handleInputChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300 ${formData.GitHubProfile && formData.GitHubProfile !== 'N/A' && formData.GitHubProfile.length > 0 && !isValidGithubUrl(formData.GitHubProfile) ? 'border-red-500' : ''}`}
                placeholder="https://github.com/username"
              />
            </div>
            {formData.GitHubProfile && formData.GitHubProfile !== 'N/A' && formData.GitHubProfile.length > 0 && !isValidGithubUrl(formData.GitHubProfile) && (
              <div className="text-red-500 text-xs mt-1">GitHub profile must start with https://github.com/ and include your username.</div>
            )}
          </div>




          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
                placeholder="Enter your city"
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
                value={formData.course || 'N/A'}
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
                value={formData.collegeBranch || 'N/A'}
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
                value={formData.collegeSemester || '0'}
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
                <option value="9">Pass out</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <select
                name="state"
                value={formData.state || ''}
                onChange={handleInputChange}
                className="w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent border-gray-300"
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
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex justify-end gap-2">
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${isFormValid() && !saving ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          onClick={handleNext}
          disabled={!isFormValid() || saving}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step1;
