import React, { useState } from 'react';
import { IoIosSave } from 'react-icons/io';
import { X } from 'lucide-react';

const Step2 = ({ setIsStep2Saved, setIsNextDisabled }) => {
  const [teamMembers, setTeamMembers] = useState([]);

  const addMemberForm = () => {
    if (teamMembers.length < 3) {
      setTeamMembers([...teamMembers, { fullName: '', email: '', phone: '', collegeName: '', course: '', collegeBranch: '', collegeSemester: '', githubLink: '' }]);
      setIsNextDisabled(true); // Disable Next button when a new form is added
    }
  };

  const removeMemberForm = (index) => {
    const updatedMembers = teamMembers.filter((_, i) => i !== index);
    setTeamMembers(updatedMembers);
    if (updatedMembers.length === 0) {
      setIsNextDisabled(false); // Enable Next button if no forms are present
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const isFormValid = (member) => {
    const requiredFields = ['fullName', 'email', 'phone', 'collegeName', 'course', 'collegeBranch', 'collegeSemester'];
    return requiredFields.every((field) => member[field] && member[field] !== 'N/A' && member[field] !== '0');
  };

  const handleSave = async () => {
    if (teamMembers.every(isFormValid)) {
      setIsStep2Saved(true); // Notify MultiStepModal that Step2 is saved
      setIsNextDisabled(false); // Enable Next button when data is saved
    } else {
      alert('Please fill all required fields for all team members.');
    }
  };

  return (
    <div className="bg-white max-w-4xl w-full mx-auto p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Team Members</h3>

      {teamMembers.map((member, index) => (
        <div key={index} className="relative bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
          <button
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            onClick={() => removeMemberForm(index)}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input
                type="text"
                value={member.fullName}
                onChange={(e) => handleInputChange(index, 'fullName', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input
                type="email"
                value={member.email}
                onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter email address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
              <input
                type="tel"
                value={member.phone}
                onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Name *</label>
              <input
                type="text"
                value={member.collegeName}
                onChange={(e) => handleInputChange(index, 'collegeName', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="Enter college name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course *</label>
              <select
                value={member.course}
                onChange={(e) => handleInputChange(index, 'course', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">College Branch *</label>
              <select
                value={member.collegeBranch}
                onChange={(e) => handleInputChange(index, 'collegeBranch', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
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
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester *</label>
              <select
                value={member.collegeSemester}
                onChange={(e) => handleInputChange(index, 'collegeSemester', e.target.value)}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
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
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub Profile (Optional)</label>
              <input
                type="url"
                value={member.githubLink}
                onChange={(e) => handleInputChange(index, 'githubLink', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
                placeholder="https://github.com/username"
              />
            </div>
          </div>
        </div>
      ))}

      {teamMembers.length < 3 && (
        <button
          onClick={addMemberForm}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Member
        </button>
      )}

      {teamMembers.length > 0 && (
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={!teamMembers.every(isFormValid)}
            className={`px-4 py-2 rounded-lg font-semibold flex gap-2 transition-colors ${teamMembers.every(isFormValid) ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            <IoIosSave className="text-xl" /> Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Step2;
