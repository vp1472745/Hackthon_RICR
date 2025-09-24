import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Mail, Phone, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { authAPI } from '../../configs/api.js';

const Verification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    emailOTP: '',
    phoneOTP: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    if (!savedData.email) {
      // Redirect to step 1 if no data found
      navigate('/register');
      return;
    }
    setFormData(prev => ({ ...prev, ...savedData }));
  }, [navigate]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.emailOTP || formData.emailOTP.length !== 6) {
      newErrors.emailOTP = 'Please enter a valid 6-digit Email OTP';
    }
    
    if (!formData.phoneOTP || formData.phoneOTP.length !== 6) {
      newErrors.phoneOTP = 'Please enter a valid 6-digit Phone OTP';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateStep()) return;
    
    setLoading(true);
    try {
      const response = await authAPI.register({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        phoneOTP: formData.phoneOTP,
        emailOTP: formData.emailOTP
      });

      if (response.data.message === 'Team created successfully') {
        // Store team and user data with updated team structure
        const registrationData = {
          ...formData,
          team: {
            ...response.data.team,
            // Team now includes teamemail from backend
            teamEmail: response.data.team.teamemail
          },
          user: response.data.user,
          registrationComplete: true
        };
        
        localStorage.setItem('registrationData', JSON.stringify(registrationData));
        
        // Show success message with team details including email
        alert(`Registration successful! 
Team ID: ${response.data.team.teamCode}
Team Email: ${response.data.team.teamemail}
Leader: ${response.data.user.fullName}`);
        
        // Navigate to payment step or dashboard
        navigate('/register/payment');
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message;
        alert(`Error: ${errorMessage}`);
      } else {
        alert('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Save current data before going back
    localStorage.setItem('registrationData', JSON.stringify(formData));
    navigate('/register');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B2A4A] mb-2">
            FutureMaze Registration
          </h1>
          <p className="text-gray-600">Step 2 of 3: OTP Verification</p>
        </div>
        <ProgressBar currentStep={2} />

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Shield className="text-[#0B2A4A] mr-2" size={24} />
              <h2 className="text-xl font-semibold text-[#0B2A4A]">Verify Your Details</h2>
            </div>
            <p className="text-gray-600 text-sm">
              Enter the OTP codes sent to your email and phone number to complete registration.
            </p>
          </div>

          {/* User Info Display */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <User className="text-gray-600 mr-2" size={16} />
              <span className="font-medium">{formData.fullName}</span>
            </div>
            <div className="flex items-center mb-2">
              <Mail className="text-gray-600 mr-2" size={16} />
              <span className="text-sm text-gray-600">{formData.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="text-gray-600 mr-2" size={16} />
              <span className="text-sm text-gray-600">+91 {formData.phone}</span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Email OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email OTP
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit email OTP"
                value={formData.emailOTP}
                onChange={(e) => handleInputChange('emailOTP', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent outline-none transition-all
                  ${errors.emailOTP ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.emailOTP && (
                <p className="text-red-500 text-sm mt-1">{errors.emailOTP}</p>
              )}
            </div>

            {/* Phone OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone OTP
              </label>
              <input
                type="text"
                maxLength="6"
                placeholder="Enter 6-digit phone OTP"
                value={formData.phoneOTP}
                onChange={(e) => handleInputChange('phoneOTP', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent outline-none transition-all
                  ${errors.phoneOTP ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phoneOTP && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneOTP}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={loading}
              className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back
            </button>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="flex items-center px-6 py-3 bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white rounded-lg transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Complete Registration'}
              <ArrowRight size={20} className="ml-2" />
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Need help?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Check your email inbox and spam folder</li>
              <li>• Ensure you entered the correct phone number</li>
              <li>• OTP codes are valid for 5 minutes</li>
              <li>• Contact support if you don't receive OTP</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;