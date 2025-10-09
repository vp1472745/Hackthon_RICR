import React, { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ProgressBar from './ProgressBar.jsx';
import { authAPI } from '../../configs/api.js';

const LeaderDetails = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaderName: '',
    leaderEmail: '',
    leaderPhone: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaderName.trim()) {
      newErrors.leaderName = 'Team leader name is required';
    }

    if (!formData.leaderEmail.trim()) {
      newErrors.leaderEmail = 'Email is required';
    } else if (!validateEmail(formData.leaderEmail)) {
      newErrors.leaderEmail = 'Please enter a valid email address';
    }

    if (!formData.leaderPhone.trim()) {
      newErrors.leaderPhone = 'Phone number is required';
    } else if (!validatePhone(formData.leaderPhone)) {
      newErrors.leaderPhone = 'Please enter a valid 10-digit Indian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNext = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Call backend API to send OTP
      const response = await authAPI.sendOTP({
        fullName: formData.leaderName,
        email: formData.leaderEmail,
        phone: formData.leaderPhone
      });

      // Store form data for next step
      const registrationData = {
        fullName: formData.leaderName,
        email: formData.leaderEmail,
        phone: formData.leaderPhone
      };

      sessionStorage.setItem('registrationData', JSON.stringify(registrationData));

      // Show success message
      toast.success('OTPs sent successfully to your email and phone! Please proceed to verification.');

      // Navigate to verification step
      navigate('/register/verification');

    } catch (error) {
      console.error('Send OTP error:', error);

      if (error.response?.data) {
        const errorMessage = error.response.data.message;

        // Handle specific errors
        if (error.response.status === 409) {
          // User already exists
          toast.error(`User already exists. Please use a different email.`);
        } else {
          toast.error(`User already exists. Please use a different email.`);
        }
      } else {
        toast.error('Registration failed. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <ProgressBar currentStep={1} />
        </div>
        
        {/* Form Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center mb-3">
              <User className="w-8 h-8 md:w-10 md:h-10 text-[#0B2A4A]" />
            </div>
            <h1 className="text-xl md:text-3xl font-bold text-[#0B2A4A] mb-2">
          Registration
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Enter your details to get started with the registration process
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4 md:space-y-6">
            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={(e) => handleInputChange('leaderName', e.target.value)}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent text-sm md:text-base ${
                  errors.leaderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.leaderName && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.leaderName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.leaderEmail}
                onChange={(e) => handleInputChange('leaderEmail', e.target.value)}
                className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent text-sm md:text-base ${
                  errors.leaderEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.leaderEmail && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.leaderEmail}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (WhatsApp) <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm md:text-base">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.leaderPhone}
                  onChange={(e) => handleInputChange('leaderPhone', e.target.value)}
                  className={`flex-1 px-3 md:px-4 py-2 md:py-3 border rounded-r-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent text-sm md:text-base ${
                    errors.leaderPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                />
              </div>
              {errors.leaderPhone && (
                <p className="text-red-500 text-xs md:text-sm mt-1">{errors.leaderPhone}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                We'll send OTP via WhatsApp for verification
              </p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 md:mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 text-sm md:text-base order-2 sm:order-1"
            >
              Back to Home
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center justify-center px-4 md:px-6 py-2 md:py-3 bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base order-1 sm:order-2 mb-3 sm:mb-0"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </>
              ) : (
                <>
                  Next: Verification
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-xs md:text-sm text-center">
              <strong>Note:</strong> You'll receive OTPs on both your email and phone number for verification in the next step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDetails;