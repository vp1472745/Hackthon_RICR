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
        setLoginMessage('Login successful! Redirecting to dashboard...');

        if (response.data.token) sessionStorage.setItem('authToken', response.data.token);

        sessionStorage.setItem('hackathonUser', JSON.stringify({
          email: formData.email,
          user: response.data.user,
          team: response.data.team,
          theme: response.data.theme,
          ProblemStatements: response.data.ProblemStatements,
          loginTime: new Date().toISOString()
        }));

        const teamId = response.data.team?._id || response.data.teamId;
        if (teamId) document.cookie = `teamId=${teamId}; path=/; max-age=${2 * 24 * 60 * 60}`;
        else alert('No teamId found! Theme selection may not work.');

        window.dispatchEvent(new Event('authChange'));

        setTimeout(() => navigate('/leader-dashboard'), 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data) setLoginMessage(`Error: ${error.response.data.message}`);
      else setLoginMessage('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info(
      <div className="flex flex-col gap-3">
        <h4 className="font-semibold text-blue-800">Team Code Recovery</h4>
        <p className="text-sm">Contact event organizers with your registered email:</p>
        <div className="text-sm space-y-1">
          <p><strong>Email:</strong> futuremaze@ricr.ac.in</p>
          <p><strong>Phone:</strong> +91 99999 99999</p>
        </div>
        <p className="text-xs text-gray-600">Only registered team leaders can request team code recovery.</p>
      </div>, {
      position: "top-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      className: 'toast-info-large'
    }
    );
  };

  return (
    <div className="min-h-screen    bg-gradient-to-br from-[#0B2A4A] via-[#1D5B9B] to-[#0B2A4A] flex items-center justify-center py-8 px-4">
      {/* decorative shapes - hidden on very small screens to save space */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hidden sm:block absolute -top-40 -right-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        <div className="hidden sm:block absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-white opacity-5"></div>
        <div className="hidden md:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-white opacity-3"></div>
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-lg">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-[#0B2A4A]" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Login</h2>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">

            {/* Team Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.teamCode}
                  onChange={(e) => handleInputChange('teamCode', e.target.value.toUpperCase())}
                  className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${errors.teamCode ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter your Team Code (e.g., FM001)"
                  autoComplete="username"
                  aria-invalid={errors.teamCode ? "true" : "false"}
                  aria-describedby={errors.teamCode ? "teamcode-error" : undefined}
                />
              </div>
              {errors.teamCode && (
                <div id="teamcode-error" className="flex items-center mt-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p>{errors.teamCode}</p>
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
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 sm:py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent transition-colors duration-200 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <div id="email-error" className="flex items-center mt-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <p>{errors.email}</p>
                </div>
              )}
            </div>

            {/* Login Message */}
            {loginMessage && (
              <div role="alert" className={`p-3 rounded-lg flex items-center ${loginMessage.includes('successful') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
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
              className="w-full flex items-center justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-[#0B2A4A] hover:bg-[#1D5B9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D5B9B] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign In
                </div>
              )}
            </button>

            {/* Register / Forgot group - stacks on small screens */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
              <div className="flex items-center gap-3">
                <p className="text-sm text-gray-800 font-medium">Not Registered ?</p>
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="py-2 px-3 text-sm sm:text-sm font-medium rounded-lg bg-[#0B2A4A] text-white hover:bg-[#1D5B9B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D5B9B] transition-colors"
                >
                  Register
                </button>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#1D5B9B] hover:underline"
                >
                  Forgot Team Code?
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
