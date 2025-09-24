import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    } else if (formData.teamCode.trim().length < 3) {
      newErrors.teamCode = 'Team Code must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
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
      // Simulate API call for authentication
      // In real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock authentication logic
      // Replace this with actual API call
      const mockCredentials = [
        { teamCode: 'FM001', email: 'team1@example.com' },
        { teamCode: 'FM002', email: 'team2@example.com' },
        { teamCode: 'FM003', email: 'leader@test.com' }
      ];

      console.log('Login attempt:', { teamCode: formData.teamCode, email: formData.email });
      
      const isValidUser = mockCredentials.some(
        cred => cred.teamCode === formData.teamCode && cred.email === formData.email
      );

      console.log('Is valid user:', isValidUser);

      if (isValidUser) {
        setLoginMessage('Login successful! Redirecting to dashboard...');
        
        // Store user session (in real app, store JWT token)
        localStorage.setItem('hackathonUser', JSON.stringify({
          teamCode: formData.teamCode,
          email: formData.email,
          loginTime: new Date().toISOString()
        }));

        // Redirect to dashboard after success message
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        setLoginMessage('Invalid Team Code or Email. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginMessage('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    alert('Team Code Recovery:\n\nPlease contact the event organizers with your registered email for team code recovery:\n\nEmail: futuremaze@ricr.ac.in\nPhone: +91 99999 99999\n\nNote: Only registered team leaders can request team code recovery.');
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

            {/* Email Field */}
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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="Enter your registered email"
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

            {/* Forgot Password */}
            <div className="text-center">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-[#1D5B9B] hover:text-[#0B2A4A] transition-colors duration-200"
              >
                Forgot your team code?
              </button>
            </div>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="font-semibold mb-2 text-center">Demo Team Credentials</h3>
          <div className="grid grid-cols-1 gap-3 text-xs">
            <div className="text-center bg-white bg-opacity-10 rounded p-2">
              <p className="font-medium">Team Code: <span className="text-yellow-200">FM001</span></p>
              <p>Email: <span className="text-yellow-200">team1@example.com</span></p>
            </div>
            <div className="text-center bg-white bg-opacity-10 rounded p-2">
              <p className="font-medium">Team Code: <span className="text-yellow-200">FM002</span></p>
              <p>Email: <span className="text-yellow-200">team2@example.com</span></p>
            </div>
          </div>
          <div className="text-center mt-3 pt-2 border-t border-white border-opacity-20">
            <p className="text-xs text-blue-200">
              ⚠️ Use your registered team code and leader email to login
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-blue-100 text-sm">
            Not a team leader yet?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-white font-medium hover:underline"
            >
              Register your team for FutureMaze
            </button>
          </p>
          <p className="text-blue-200 text-xs">
            Need help? Contact us at{' '}
            <a href="mailto:futuremaze@ricr.ac.in" className="text-white hover:underline">
              futuremaze@ricr.ac.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
