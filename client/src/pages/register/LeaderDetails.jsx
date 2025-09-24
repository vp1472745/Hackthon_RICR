import React, { useState } from 'react';
import { ArrowRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
      await authAPI.sendOTP({
        fullName: formData.leaderName,
        email: formData.leaderEmail,
        phone: formData.leaderPhone
      });

      // Store user data in localStorage for next step
      const registrationData = {
        fullName: formData.leaderName,
        email: formData.leaderEmail,
        phone: formData.leaderPhone
      };
      
      localStorage.setItem('registrationData', JSON.stringify(registrationData));
      
      // Show success message
      alert('OTPs sent successfully to your email and phone!');
      
      // Navigate to verification step
      navigate('/register/verification');
      
    } catch (error) {
      console.error('Send OTP error:', error);
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message || 'An error occurred';
        
        // Handle specific errors
        if (error.response.status === 400) {
          // User already exists or validation error
          alert(`Error: ${errorMessage}`);
          
          // If user exists but not verified, allow to proceed
          if (error.response.data.existingUser) {
            const existingUser = error.response.data.existingUser;
            if (!existingUser.isEmailVerified || !existingUser.isPhoneVerified) {
              const confirmProceed = window.confirm(
                'User already exists but verification is incomplete. Would you like to proceed to verification?'
              );
              if (confirmProceed) {
                localStorage.setItem('registrationData', JSON.stringify({
                  leaderEmail: existingUser.email,
                  leaderPhone: existingUser.phone,
                  isEmailVerified: existingUser.isEmailVerified,
                  isPhoneVerified: existingUser.isPhoneVerified
                }));
                navigate('/register/verification');
              }
            }
          }
        } else {
          alert(`Registration failed: ${errorMessage}`);
        }
      } else {
        alert('Registration failed. Please check your internet connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B2A4A] mb-2">
            FutureMaze Registration
          </h1>
          <p className="text-gray-600">Step 1 of 3: Team Leader Details</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={1} />

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.leaderName}
                onChange={(e) => handleInputChange('leaderName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent ${
                  errors.leaderName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.leaderName && (
                <p className="text-red-500 text-sm mt-1">{errors.leaderName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.leaderEmail}
                onChange={(e) => handleInputChange('leaderEmail', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent ${
                  errors.leaderEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.leaderEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.leaderEmail}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  +91
                </span>
                <input
                  type="tel"
                  value={formData.leaderPhone}
                  onChange={(e) => handleInputChange('leaderPhone', e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-r-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent ${
                    errors.leaderPhone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                />
              </div>
              {errors.leaderPhone && (
                <p className="text-red-500 text-sm mt-1">{errors.leaderPhone}</p>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => navigate('/')}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Back to Home
            </button>

            <button
              onClick={handleNext}
              disabled={loading}
              className="flex items-center px-6 py-2 bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Registering...
                </>
              ) : (
                <>
                  Next: Verification
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderDetails;