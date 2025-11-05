import React, { useState } from 'react';
import { User, Lock, LogIn, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../../configs/api.js';
import { toast } from 'react-hot-toast';

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

      if (response.data?.message) {
        const userRole = response.data.user?.role;
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
        else console.warn('No teamId found — theme selection may not work.');

        // Notify AuthContext (if any) -- existing approach
        window.dispatchEvent(new Event('authChange'));

        // Role-based redirection
        let redirectPath = '/leader-dashboard';
        if (userRole === 'Member') redirectPath = '/member-dashboard';

        setTimeout(() => navigate(redirectPath), 600);
      } else {
        // fallback message
        setLoginMessage('Unexpected response from server.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) setLoginMessage(`Error: ${error.response.data.message}`);
      else setLoginMessage('Login failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#07203a] via-[#0b3b67] to-[#07203a] py-8 px-4 ">
      {/* Decorative background shapes (responsive & subtle) */}
      <div aria-hidden className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hidden md:block absolute -top-36 -right-36 w-80 h-80 rounded-full bg-white opacity-5" />
        <div className="hidden md:block absolute -bottom-36 -left-36 w-80 h-80 rounded-full bg-white opacity-5" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white opacity-3 md:opacity-6" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="mx-auto w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Shield className="w-10 h-10 text-[#0B2A4A]" />
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">Login</h2>
          <p className="text-sm text-slate-200 mt-2">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Team Code */}
            <div>
              <label htmlFor="teamCode" className="block text-sm font-medium text-gray-700 mb-2">
                Team Code <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="teamCode"
                  name="teamCode"
                  type="text"
                  inputMode="text"
                  value={formData.teamCode}
                  onChange={(e) => handleInputChange('teamCode', e.target.value.toUpperCase())}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg transition-colors duration-150 border ${errors.teamCode ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1D5B9B]`}
                  placeholder="Enter your Team Code (e.g., NK001)"
                  autoComplete="username"
                  aria-invalid={Boolean(errors.teamCode)}
                />
              </div>
              {errors.teamCode && (
                <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <p>{errors.teamCode}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 rounded-lg transition-colors duration-150 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#1D5B9B]`}
                  placeholder="Enter your registered email"
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  style={{ textTransform: 'none' }}
                />
              </div>
              {errors.email && (
                <div className="flex items-start gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <p>{errors.email}</p>
                </div>
              )}
            </div>

            {/* Login message (aria-live) */}
            {loginMessage && (
              <div
                role="status"
                aria-live="polite"
                className={`flex items-start gap-2 p-3 rounded-lg text-sm ${loginMessage.includes('successful') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}
              >
                {loginMessage.includes('successful') ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />}
                <div>{loginMessage}</div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg text-white font-medium bg-[#0B2A4A] hover:bg-[#133e6a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D5B9B] disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>

            {/* register link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-gray-600">Not registered?</p>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 rounded-lg text-white bg-[#0B2A4A] hover:bg-[#133e6a] transition"
              >
                Register
              </button>
            </div>
          </form>
        </div>

        {/* small footer note */}
        <p className="text-xs text-center text-slate-200 mt-4">
          By signing in you agree to the event terms & conditions.
        </p>
      </div>
    </div>
  );
};

export default Login;
