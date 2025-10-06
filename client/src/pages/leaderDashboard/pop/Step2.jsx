// Step2.jsx
import React, { useState, useEffect } from 'react';
import { X, Loader } from 'lucide-react';
import { userAPI } from '../../../configs/api';
import { toast } from 'react-hot-toast';

const Step2 = ({ setIsStep2Saved, handleBack, handleNext }) => {
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [leaderProfile, setLeaderProfile] = useState(null);

  // Try to read leader profile from sessionStorage, else fetch
  useEffect(() => {
    const cached = sessionStorage.getItem('leaderProfile');
    if (cached) {
      try {
        setLeaderProfile(JSON.parse(cached));
      } catch (e) {
        console.warn('Invalid session leaderProfile, clearing.', e);
        sessionStorage.removeItem('leaderProfile');
        fetchLeader();
      }
    } else {
      fetchLeader();
    }
  }, []);

  const fetchLeader = async () => {
    try {
      const res = await userAPI.getLeaderProfile();
      if (res?.data?.leader) {
        setLeaderProfile(res.data.leader);
        sessionStorage.setItem('leaderProfile', JSON.stringify(res.data.leader));
      }
    } catch (err) {
      console.warn('Could not fetch leader profile for Step2', err);
    }
  };

  // Update isNextDisabled depending on forms validity & loading
  useEffect(() => {
    if (loading) {
      setIsNextDisabled(true);
      return;
    }
    if (teamMembers.length === 0) {
      setIsNextDisabled(false);
    } else {
      const allFormsValid = teamMembers.every(isFormValid);
      setIsNextDisabled(!allFormsValid);
    }
  }, [teamMembers, loading]);

  const addMemberForm = () => {
    if (teamMembers.length < 3) {
      setTeamMembers(prev => [
        ...prev,
        {
          fullName: '',
          email: '',
          phone: '',
          collegeName: '',
          course: 'N/A',
          collegeBranch: 'N/A',
          collegeSemester: '0',
          githubLink: ''
        }
      ]);
      setErrors(prev => [...prev, {}]);
    } else {
      toast.info('Maximum 3 members allowed.');
    }
  };

  const removeMemberForm = (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
    setErrors(errors.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setTeamMembers(updatedMembers);

    const updatedErrors = [...errors];
    updatedErrors[index] = { ...updatedErrors[index], [field]: '' };
    setErrors(updatedErrors);
  };

  const isFormValid = (member) => {
    const requiredFields = ['fullName', 'email', 'phone', 'collegeName', 'course', 'collegeBranch', 'collegeSemester'];
    return requiredFields.every(f => {
      const val = member[f];
      return val !== undefined && val !== null && val !== '' && val !== 'N/A' && val !== '0';
    });
  };

  const validateAll = () => {
    const newErrors = teamMembers.map(member => {
      const err = {};
      if (!member.fullName) err.fullName = 'Full name is required';
      if (!member.email) err.email = 'Email is required';
      if (!member.phone) err.phone = 'Phone number is required';
      if (!member.collegeName) err.collegeName = 'College name is required';
      if (!member.course || member.course === 'N/A') err.course = 'Course is required';
      if (!member.collegeBranch || member.collegeBranch === 'N/A') err.collegeBranch = 'Branch is required';
      if (!member.collegeSemester || member.collegeSemester === '0') err.collegeSemester = 'Semester is required';
      return err;
    });
    setErrors(newErrors);
    return newErrors.every(e => Object.keys(e).length === 0);
  };

  const hasDuplicates = (members) => {
    const emails = members.map(member => member.email?.trim().toLowerCase() || '');
    const phones = members.map(member => member.phone?.trim() || '');
    const emailSet = new Set(emails.filter(e => e));
    const phoneSet = new Set(phones.filter(p => p));
    return emailSet.size !== emails.filter(e => e).length || phoneSet.size !== phones.filter(p => p).length;
  };


  const saveTeamMembers = async (members) => {
    setLoading(true);
    let allSaved = true;
    try {
      for (const member of members) {

        try {
          await userAPI.addMember(member); // Send each member individually
        } catch (error) {
          allSaved = false;
          if (error.response?.status === 409) {
            toast.error(`Member with email ${member.email} already exists in the team.`);
          } else {
            throw error; // Re-throw other errors to be handled below
          }
        }
      }
      if (allSaved) {
        toast.success('Team members saved successfully.');
      }
    } catch (error) {
      allSaved = false;
      if (error.response?.status === 400) {
        toast.error('Bad Request: ' + (error.response?.data?.error || 'Invalid data.'));
      } else {
        toast.error('Failed to save members: ' + (error.response?.data?.message || error.message));
      }
      console.error('Save failed:', error);
    } finally {
      setLoading(false);
    }
    return allSaved;
  };

  return (
    <div className="bg-white max-w-4xl w-full mx-auto p-4 sm:p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Team Members</h3>

      {/* Team Members Section */}
      <div className="space-y-4">
        {/* Team Member List */}
        {teamMembers.map((member, index) => (
          <div key={index} className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => removeMemberForm(index)}
              type="button"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['fullName', 'email', 'phone', 'collegeName'].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {field === 'fullName' ? 'Full Name *' : field === 'email' ? 'Email Address *' : field === 'phone' ? 'Phone Number *' : 'College Name *'}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                    value={member[field]}
                    onChange={(e) => handleInputChange(index, field, e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${errors[index]?.[field] ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder={`Enter ${field}`}
                    disabled={loading}
                  />
                  {errors[index]?.[field] && <p className="text-red-500 text-sm mt-1">{errors[index][field]}</p>}
                </div>
              ))}

              {/* Course */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
                <select
                  value={member.course}
                  onChange={(e) => handleInputChange(index, 'course', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${errors[index]?.course ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loading}
                >
                  <option value="N/A">Select Course</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.E">B.E</option>
                  <option value="BCA">BCA</option>
                  <option value="MCA">MCA</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.E">M.E</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                  <option value="B.Com">B.Com</option>
                  <option value="M.Com">M.Com</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Ph.D">Ph.D</option>
                </select>
              </div>

              {/* Branch */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">College Branch *</label>
                <select
                  value={member.collegeBranch}
                  onChange={(e) => handleInputChange(index, 'collegeBranch', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${errors[index]?.collegeBranch ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loading}
                >
                  <option value="N/A">Select Branch</option>
                  <option value="Computer Science Engineering">CSE</option>
                  <option value="Information Technology">IT</option>
                  <option value="Electronics and Communication">ECE</option>
                  <option value="Electrical Engineering">EE</option>
                </select>
              </div>

              {/* Semester */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
                <select
                  value={member.collegeSemester}
                  onChange={(e) => handleInputChange(index, 'collegeSemester', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${errors[index]?.collegeSemester ? 'border-red-500' : 'border-gray-300'}`}
                  disabled={loading}
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

              {/* GitHub */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile (Optional)</label>
                <input
                  type="url"
                  value={member.githubLink}
                  onChange={(e) => handleInputChange(index, 'githubLink', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                  placeholder="https://github.com/username"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        ))}

        {teamMembers.length < 3 && (
          <button
            onClick={addMemberForm}
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-3"
            disabled={loading}
          >
            Add Member
          </button>
        )}
      </div>

      <div className="mt-3 flex justify-between items-center">
        <button onClick={handleBack} type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" disabled={loading}>
          Back
        </button>

        <button
          onClick={async () => {
            if (teamMembers.length === 0) {
              setIsStep2Saved(true);
              handleNext();
              return;
            }

            // validate & save
            if (!validateAll()) {
              toast.error('Please fill all required fields correctly.');
              return;
            }

            if (hasDuplicates(teamMembers)) {
              toast.error('Duplicate emails or phone numbers found. Please remove duplicates.');
              return;
            }

            try {
              const allSaved = await saveTeamMembers(teamMembers);
              if (allSaved) {
                setIsStep2Saved(true);
                handleNext();
              }
            } catch (err) {
              console.error('Save failed', err);
            }
          }}
          disabled={isNextDisabled || loading}
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${isNextDisabled || loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
        >
          {loading && <Loader className="w-4 h-4 animate-spin mr-2 inline" />}
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2;
