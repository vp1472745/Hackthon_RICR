import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../configs/api.js';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    teamCode: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear login message
    if (loginMessage) {
      setLoginMessage('');
    }
  };

  // Validation function
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.teamCode.trim()) {
      newErrors.teamCode = 'Team Code is required';
    } else if (!formData.teamCode.match(/^RICR-FM-\d{4}$/)) {
      newErrors.teamCode = 'Team Code format should be RICR-FM-XXXX (e.g., RICR-FM-0001)';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Team email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid team email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setLoginMessage('');

    try {
      // Debug: Log the data being sent
      console.log('Sending login data:', {
        teamCode: formData.teamCode,
        teamemail: formData.email
      });

      // Call backend Login API with updated parameters
      const response = await authAPI.login({
        teamCode: formData.teamCode,
        teamemail: formData.email
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        setLoginMessage('Login successful! Redirecting to dashboard...');
        
        // Store team session with complete data from backend
        localStorage.setItem('hackathonUser', JSON.stringify({
          team: response.data.team,
          loginTime: new Date().toISOString(),
          isLoggedIn: true
        }));

        // Redirect to dashboard after success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setLoginMessage(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
    
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B2A4A] via-[#1D5B9B] to-[#0B2A4A] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white opacity-3"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-[#0B2A4A]" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Team Leader Login
          </h2>
          <p className="text-blue-100">
            Only team leaders can access the dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Team Code Field */}
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${
                    errors.teamCode ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your Team Code (e.g., RICR-FM-0001)"
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

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your team's registered email"
                  autoComplete="email"
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
              <div className={`p-3 rounded-lg flex items-center ${
                loginMessage.includes('successful') 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                {loginMessage.includes('successful') ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                )}
                <p className={`text-sm ${
                  loginMessage.includes('successful') ? 'text-green-700' : 'text-red-700'
                }`}>
                  {loginMessage}
                </p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#0B2A4A] hover:bg-[#1D5B9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D5B9B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

          </form>
        </div>


      </div>
    </div>
  );
};

export default Login;
