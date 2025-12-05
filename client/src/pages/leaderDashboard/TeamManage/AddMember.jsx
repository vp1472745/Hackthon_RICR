import React from 'react';
import { Loader } from 'lucide-react';

const AddMember = ({ 
  showAddMember, 
  newMember, 
  setNewMember, 
  errors, 
  loading, 
  cancelEdit 
}) => {
  if (!showAddMember) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Add New Team Member
        </h3>
        {loading && <Loader className="w-5 h-5 animate-spin text-[#0B2A4A]" />}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={newMember.fullName}
            onChange={(e) => setNewMember({...newMember, fullName: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
            disabled={loading}
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={newMember.email}
            onChange={(e) => setNewMember({...newMember, email: e.target.value.toLowerCase()})}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={newMember.phone}
            onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
            disabled={loading}
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">City</label>
          <input
            type="text"
            value={newMember.city || ''}
            onChange={(e) => setNewMember({...newMember, city: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            placeholder="Enter city"
            disabled={loading}
          />
        </div>

        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">State</label>
          <select
            value={newMember.state || ''}
            onChange={(e) => setNewMember({...newMember, state: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            disabled={loading}
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
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">College Name</label>
          <input
            type="text"
            value={newMember.collegeName}
            onChange={(e) => setNewMember({...newMember, collegeName: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            placeholder="Enter college name"
            disabled={loading}
          />
        </div>
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">Course</label>
          <select
            value={newMember.course}
            onChange={(e) => setNewMember({...newMember, course: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            disabled={loading}
          >
            <option value="">Select Course</option>
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
          <label className=" text-sm font-medium text-gray-700 mb-2">College Branch</label>
          <select
            value={newMember.collegeBranch}
            onChange={(e) => setNewMember({...newMember, collegeBranch: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            disabled={loading}
          >
            <option value="">Select Branch</option>
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
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">Semester</label>
          <select
            value={newMember.collegeSemester}
            onChange={(e) => setNewMember({...newMember, collegeSemester: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            disabled={loading}
          >
            <option value="">Select Semester</option>
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
        
        <div>
          <label className=" text-sm font-medium text-gray-700 mb-2">GitHub Profile (Optional)</label>
          <input
            type="url"
            value={newMember.GitHubProfile}
            onChange={(e) => setNewMember({...newMember, GitHubProfile: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent"
            placeholder="https://github.com/username"
            disabled={loading}
          />
        </div>
      </div>
      
      <div className="flex gap-3 mt-6">
      
      
        <button
          onClick={cancelEdit}
          disabled={loading}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddMember;