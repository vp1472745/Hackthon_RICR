import React, { useState, useEffect } from 'react';
import { accomodationAPI, userAPI } from '../../../configs/api';
import { ChevronDown } from 'lucide-react';

const Accomodation = () => {
  const [form, setForm] = useState({ teamid: '', name: '', phone: '', book: '', member: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const cached = sessionStorage.getItem('leaderProfile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        const teamId = parsed?.team?._id || parsed?.teamId || parsed?.member?.teamId || parsed?.teamid || parsed?._id;
        if (teamId) setForm(f => ({ ...f, teamid: teamId }));
        return;
      } catch (e) {
        sessionStorage.removeItem('leaderProfile');
      }
    }

    const fetchLeader = async () => {
      try {
        const res = await userAPI.getLeaderProfile();
        const leader = res?.data?.leader;
        const team = res?.data?.team;
        const teamId = team?._id || leader?.teamId || leader?.teamid || leader?._id;
        if (leader) sessionStorage.setItem('leaderProfile', JSON.stringify(leader));
        if (teamId) setForm(f => ({ ...f, teamid: teamId }));
      } catch (err) {
        console.warn('Could not fetch leader profile for accomodation form', err);
      }
    };

    fetchLeader();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const payload = { ...form };
      const res = await accomodationAPI.createAccomodation(payload);
      setMessage({ type: 'success', text: 'Accommodation created successfully!' });
      setForm({ teamid: '', name: '', phone: '', book: '', member: '' });
    } catch (err) {
      console.error(err);
      const text = err?.response?.data?.message || err.message || 'Failed to create accommodation';
      setMessage({ type: 'error', text });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8">
      <div className="max-w-1xl ">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3">
            <div className="text-center">
              <h1 className="text-1xl font-bold text-white ">Accommodation Booking</h1>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-8 sm:px-8">
            {message && (
              <div className={`mb-6 p-4 rounded-lg border ${
                message.type === 'success' 
                  ? 'bg-green-50 border-green-200 text-green-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    message.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="font-medium">{message.text}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Team ID Field - Only shown if not auto-filled */}
              {!form.teamid && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Team ID</label>
                  <input 
                    name="teamid" 
                    value={form.teamid} 
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    placeholder="Enter your team ID"
                  />
                </div>
              )}

              {/* Name Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                <input 
                  name="phone" 
                  value={form.phone} 
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Booking Selection */}
              <div className="space-y-2">
                <label className="block  text-sm font-semibold text-gray-700">Accommodation Type</label>
                <div className="relative ">
                  <select name="book" value={form.book} onChange={handleChange} className="w-full cursor-pointer border px-3 py-2 rounded appearance-none">
                    <option value="">Select accommodation</option>
                    <option value="RICR Hostel">RICR Hostel</option>
                    <option value="NIST Hostel">NIIST Hostel</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </div>

              {/* Number of Members */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Number of Members</label>
                <input 
                  name="member" 
                  value={form.member} 
                  onChange={handleChange}
                  type="number"
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Enter number of team members"
                />
              </div>

              {/* Submit Button */}
              <div >
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r cursor-pointer from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Book Accommodation'
                  )}
                </button>
              </div>
            </form>


          </div>
        </div>
      </div>
    </div>
  );
};

export default Accomodation;