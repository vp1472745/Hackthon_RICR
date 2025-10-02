import React, { useState } from 'react';
import { AdminAPI } from '../../../configs/api';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiShield, 
  FiCheckCircle, 
  FiAlertCircle,
  FiSend,
  FiArrowLeft,
  FiKey
} from 'react-icons/fi';

const initialForm = {
  username: '',
  email: '',
  phone: '',
  password: '',
  role: 'admin',
  emailOTP: '',
  phoneOTP: '',
};

const AdminRegister = () => {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError('');

    // Calculate password strength
    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { email, phone } = form;
      if (!form.username || !email || !phone || !form.password) {
        setError('All fields are required');
        setLoading(false);
        return;
      }
      await AdminAPI.sendAdminOTP({ email, phone });
      setSuccess('Verification codes sent to your email and phone');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send verification codes');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { email, phone, emailOTP, phoneOTP } = form;
      if (!emailOTP || !phoneOTP) {
        setError('Both verification codes are required');
        setLoading(false);
        return;
      }
      await AdminAPI.verifyAdminOTP({ email, phone, emailOTP, phoneOTP });
      setSuccess('Identity verified successfully! Complete your registration.');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid verification codes');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { username, email, phone, password, role } = form;
      await AdminAPI.registerAdmin({ username, email, phone, password, role });
      setSuccess('Admin account created successfully!');
      setForm(initialForm);
      setStep(1);
      setPasswordStrength(0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create admin account');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <FiShield className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Admin Registration</h1>
          <p className="text-gray-600">Secure multi-step administrator setup</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`flex flex-col items-center ${step >= stepNumber ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                    step >= stepNumber 
                      ? 'bg-blue-600 border-blue-600 text-white' 
                      : 'border-gray-300 bg-white'
                  } font-semibold transition-all duration-300`}>
                    {step > stepNumber ? <FiCheckCircle size={16} /> : stepNumber}
                  </div>
                  <span className="text-xs mt-2 font-medium">
                    {stepNumber === 1 ? 'Details' : stepNumber === 2 ? 'Verify' : 'Complete'}
                  </span>
                </div>
                {stepNumber < 3 && (
                  <div className={`w-12 h-1 mx-2 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-300'
                  } transition-all duration-300`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-8">
            {/* Error & Success Messages */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mb-6">
                <FiAlertCircle className="text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
                <FiCheckCircle className="text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            {/* Step 1: Basic Information */}
            {step === 1 && (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Username */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiUser className="text-blue-500" size={16} />
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter username"
                        required
                      />
                      <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiMail className="text-blue-500" size={16} />
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter email address"
                        required
                      />
                      <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiPhone className="text-blue-500" size={16} />
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter phone number"
                        required
                      />
                      <FiPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                      <FiLock className="text-blue-500" size={16} />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Create a strong password"
                        required
                      />
                      <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {form.password && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-600">Password strength:</span>
                          <span className={`font-medium ${
                            passwordStrength === 1 ? 'text-red-600' :
                            passwordStrength === 2 ? 'text-yellow-600' :
                            passwordStrength === 3 ? 'text-blue-600' :
                            passwordStrength === 4 ? 'text-green-600' : 'text-gray-600'
                          }`}>
                            {getPasswordStrengthText()}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                            style={{ width: `${(passwordStrength / 4) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending Verification Codes...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Send Verification Codes
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiKey className="text-blue-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Verify Your Identity</h3>
                  <p className="text-gray-600 text-sm">
                    Enter the verification codes sent to your email and phone
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email OTP */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Email Code
                    </label>
                    <input
                      type="text"
                      name="emailOTP"
                      value={form.emailOTP}
                      onChange={handleChange}
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-widest"
                      placeholder="123456"
                      required
                    />
                    <p className="text-xs text-gray-500">Check your email</p>
                  </div>

                  {/* Phone OTP */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      SMS Code
                    </label>
                    <input
                      type="text"
                      name="phoneOTP"
                      value={form.phoneOTP}
                      onChange={handleChange}
                      maxLength={6}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center text-lg font-mono tracking-widest"
                      placeholder="654321"
                      required
                    />
                    <p className="text-xs text-gray-500">Check your phone</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <FiArrowLeft size={16} />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={16} />
                        Verify & Continue
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Complete Registration */}
            {step === 3 && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiCheckCircle className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Complete Registration</h3>
                  <p className="text-gray-600 text-sm">
                    Your identity has been verified. Complete the admin registration.
                  </p>
                </div>

                {/* Verified Info Display */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3 text-blue-800">
                    <FiCheckCircle className="flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-semibold">Verified Contact Information</p>
                      <p>Email: {form.email} • Phone: {form.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <FiCheckCircle size={16} />
                        Complete Registration
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-gray-600 text-center">
              All information is securely encrypted and protected.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;