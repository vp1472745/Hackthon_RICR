import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Shield, Mail, Phone, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { authAPI } from '../../configs/api.js';

const Verification = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  const [formData, setFormData] = useState({
    emailOTP: '',
    phoneOTP: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState({ email: false, phone: false });

  useEffect(() => {
    // Get registration data from localStorage
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
      // If no registration data, redirect to first step
      navigate('/register');
      return;
    }
    
    try {
      const parsedData = JSON.parse(savedData);
      setRegistrationData(parsedData);
    } catch (error) {
      console.error('Error parsing registration data:', error);
      navigate('/register');
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.emailOTP.trim()) {
      newErrors.emailOTP = 'Email OTP is required';
    } else if (formData.emailOTP.length !== 6) {
      newErrors.emailOTP = 'OTP must be 6 digits';
    }
    
    if (!formData.phoneOTP.trim()) {
      newErrors.phoneOTP = 'Phone OTP is required';
    } else if (formData.phoneOTP.length !== 6) {
      newErrors.phoneOTP = 'OTP must be 6 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    setFormData(prev => ({ ...prev, [field]: numericValue }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const resendOTP = async (type) => {
    if (!registrationData) return;
    
    setResending(prev => ({ ...prev, [type]: true }));
    
    try {
      await authAPI.sendOTP({
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone
      });
      
      alert(`${type === 'email' ? 'Email' : 'Phone'} OTP resent successfully!`);
    } catch (error) {
      console.error(`Resend ${type} OTP error:`, error);
      alert(`Failed to resend ${type} OTP. Please try again.`);
    } finally {
      setResending(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleVerify = async () => {
    if (!validateForm() || !registrationData) return;
    
    setLoading(true);
    try {
      // Call backend API to verify OTPs and complete registration
      const response = await authAPI.register({
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        emailOTP: formData.emailOTP,
        phoneOTP: formData.phoneOTP
      });

      if (response.data.message) {
        // Store team information
        const teamData = {
          ...registrationData,
          team: response.data.team,
          user: response.data.user,
          registrationComplete: true
        };
        
        localStorage.setItem('registrationData', JSON.stringify(teamData));
        
        // Show success message
        alert(`Registration successful! Team created: ${response.data.team.teamCode}`);
        
        // Navigate to success page or login
        navigate('/login');
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message;
        
        // Handle specific errors
        if (errorMessage.includes('Email OTP')) {
          setErrors(prev => ({ ...prev, emailOTP: errorMessage }));
        } else if (errorMessage.includes('Phone OTP')) {
          setErrors(prev => ({ ...prev, phoneOTP: errorMessage }));
        } else {
          alert(`Error: ${errorMessage}`);
        }
      } else {
        alert('Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/register');
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#0B2A4A] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={2} />
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0B2A4A] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Details</h2>
            <p className="text-gray-600">
              We've sent OTPs to your email and phone number. Please enter them below to complete verification.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email OTP sent to: {registrationData.email}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit email OTP"
                  value={formData.emailOTP}
                  onChange={(e) => handleInputChange('emailOTP', e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                    errors.emailOTP ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => resendOTP('email')}
                  disabled={resending.email}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${resending.email ? 'animate-spin' : ''}`} />
                  Resend
                </button>
              </div>
              {errors.emailOTP && <p className="text-red-500 text-sm mt-1">{errors.emailOTP}</p>}
            </div>

            {/* Phone OTP */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone OTP sent to: +91 {registrationData.phone}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit phone OTP"
                  value={formData.phoneOTP}
                  onChange={(e) => handleInputChange('phoneOTP', e.target.value)}
                  className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent ${
                    errors.phoneOTP ? 'border-red-500' : 'border-gray-300'
                  }`}
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => resendOTP('phone')}
                  disabled={resending.phone}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${resending.phone ? 'animate-spin' : ''}`} />
                  Resend
                </button>
              </div>
              {errors.phoneOTP && <p className="text-red-500 text-sm mt-1">{errors.phoneOTP}</p>}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            
            <button
              type="button"
              onClick={handleVerify}
              disabled={loading || !formData.emailOTP || !formData.phoneOTP}
              className="flex-1 flex items-center justify-center gap-2 bg-[#0B2A4A] text-white px-6 py-3 rounded-lg hover:bg-[#0d2d4f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> OTPs are valid for 5 minutes. If you don't receive them, please check your spam folder or click the resend button.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;