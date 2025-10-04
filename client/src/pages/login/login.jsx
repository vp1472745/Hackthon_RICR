import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../configs/api.js';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ teamCode: '', email: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    if (loginMessage) setLoginMessage('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.teamCode.trim()) newErrors.teamCode = 'Team Code is required';
    else if (formData.teamCode.trim().length < 3) newErrors.teamCode = 'Team Code must be at least 3 characters';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setLoginMessage('');

    try {
      const response = await authAPI.login({
        teamCode: formData.teamCode,
        email: formData.email
      });

      if (response.data.message) {
        const userRole = response.data.user.role;
        const dashboardType = userRole === 'Leader' ? 'Leader Dashboard' : 'Member Dashboard';
        setLoginMessage(`Login successful! Redirecting to ${dashboardType}...`);

        // Store token
        if (response.data.token) sessionStorage.setItem('authToken', response.data.token);

        // Store user session
        sessionStorage.setItem('hackathonUser', JSON.stringify({
          email: formData.email,
          user: response.data.user,
          team: response.data.team,
          theme: response.data.theme,
          ProblemStatements: response.data.ProblemStatements,
          loginTime: new Date().toISOString()
        }));

        // Store teamId in cookie (2 days)
        const teamId = response.data.team?._id || response.data.teamId;
        if (teamId) document.cookie = `teamId=${teamId}; path=/; max-age=${2 * 24 * 60 * 60}`;
        else alert('No teamId found! Theme selection may not work.');

        // Dispatch custom event to update AuthContext immediately
        window.dispatchEvent(new Event('authChange'));

        // Role-based redirection
        let redirectPath = '/leader-dashboard'; // default
        
        if (userRole === 'Leader') {
          redirectPath = '/leader-dashboard';
        } else if (userRole === 'Member') {
          redirectPath = '/member-dashboard';
        }

        setTimeout(() => navigate(redirectPath), 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data) setLoginMessage(`Error: ${error.response.data.message}`);
      else setLoginMessage('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-gradient-to-br from-[#0B2A4A] via-[#1D5B9B] to-[#0B2A4A] flex items-center h-full justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white opacity-3"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 h-f">
        <div className="text-center">
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-[#0B2A4A]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Login</h2>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">

            {/* Team Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.teamCode}
                  onChange={(e) => handleInputChange('teamCode', e.target.value.toUpperCase())}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${errors.teamCode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter your Team Code (e.g., FM001)"
                  autoComplete="username"
                />
              </div>
              {errors.teamCode && (
                <div className="flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-red-500 text-sm">{errors.teamCode}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  style={{ textTransform: 'none' }}
                />
              </div>
              {errors.email && (
                <div className="flex items-center mt-1">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p className="text-red-500 text-sm">{errors.email}</p>
                </div>
              )}
            </div>

            {/* Login Message */}
            {loginMessage && (
              <div className={`p-3 rounded-lg flex items-center ${loginMessage.includes('successful') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                {loginMessage.includes('successful') ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p className={`text-sm ${loginMessage.includes('successful') ? 'text-green-700' : 'text-red-700'}`}>
                  {loginMessage}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center cursor-pointer justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0B2A4A] hover:bg-[#1D5B9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D5B9B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Sign In
                </div>
              )}
            </button>

            {/* Register Button */}
            <div className='text-center flex flex-row gap-4 items-center justify-center'>
              <p className='text-sm text-black font-medium mt-1/2'>Not Registered ?</p>
              <button
                onClick={() => navigate('/register')}
                className=" flex items-center justify-center py-2 mt-1 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0B2A4A] cursor-pointer hover:bg-[#1D5B9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors duration-200"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;