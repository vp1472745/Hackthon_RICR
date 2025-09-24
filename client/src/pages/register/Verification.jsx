import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Mail, Phone, CheckCircle, Shield, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { authAPI } from '../../configs/api.js';

const Verification = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    emailOtp: '',
    phoneOtp: '',
    isEmailVerified: false,
    isPhoneVerified: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    if (!savedData.leaderEmail) {
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

  // Send OTP functions
  const sendEmailOtp = async () => {
    setLoading(true);
    try {
      const response = await authAPI.sendEmailOtp(formData.leaderEmail);
      
      if (response.data.success) {
        alert(`OTP sent to ${formData.leaderEmail}`);
        console.log('Development OTP:', response.data.otp); // For testing in development
      }
    } catch (error) {
      console.error('Failed to send email OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async () => {
    setLoading(true);
    try {
      const response = await authAPI.sendPhoneOtp(formData.leaderPhone);
      
      if (response.data.success) {
        alert(`OTP sent to +91${formData.leaderPhone}`);
        console.log('Development OTP:', response.data.otp); // For testing in development
      }
    } catch (error) {
      console.error('Failed to send phone OTP:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send OTP. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP functions
  const verifyEmailOtp = async () => {
    if (formData.emailOtp.length !== 6) {
      alert('Please enter a 6-digit OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.verifyEmailOtp(formData.leaderEmail, formData.emailOtp);
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, isEmailVerified: true }));
        alert('Email verified successfully!');
        
        // Update localStorage
        const savedData = JSON.parse(localStorage.getItem('registrationData') || '{}');
        localStorage.setItem('registrationData', JSON.stringify({
          ...savedData,
          isEmailVerified: true
        }));
      }
    } catch (error) {
      console.error('Email verification failed:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const verifyPhoneOtp = async () => {
    if (formData.phoneOtp.length !== 6) {
      alert('Please enter a 6-digit OTP');
      return;
    }
    
    setLoading(true);
    try {
      const response = await authAPI.verifyPhoneOtp(formData.leaderPhone, formData.phoneOtp);
      
      if (response.data.success) {
        setFormData(prev => ({ ...prev, isPhoneVerified: true }));
        alert('Phone number verified successfully!');
        
        // Update localStorage
        const savedData = JSON.parse(localStorage.getItem('registrationData') || '{}');
        localStorage.setItem('registrationData', JSON.stringify({
          ...savedData,
          isPhoneVerified: true
        }));
      }
    } catch (error) {
      console.error('Phone verification failed:', error);
      const errorMessage = error.response?.data?.message || 'Invalid OTP. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (!formData.isEmailVerified) {
      newErrors.emailOtp = 'Please verify your email';
    }
    
    if (!formData.isPhoneVerified) {
      newErrors.phoneOtp = 'Please verify your phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      // Save updated data
      localStorage.setItem('registrationData', JSON.stringify(formData));
      navigate('/register/payment');
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
          <p className="text-gray-600">Step 2 of 3: Verification</p>
        </div>
        <ProgressBar currentStep={2} />

        {/* Verification Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
            {/* Email Verification */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Mail className="text-[#0B2A4A] mr-2" size={20} />
                  <span className="font-medium">Email Verification</span>
                </div>
                {formData.isEmailVerified && (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">{formData.leaderEmail}</p>
              
              {!formData.isEmailVerified ? (
                <div className="space-y-3">
                  <button
                    onClick={sendEmailOtp}
                    disabled={loading}
                    className="w-full bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send Email OTP'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.emailOtp}
                      onChange={(e) => handleInputChange('emailOtp', e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D5B9B]"
                    />
                    <button
                      onClick={verifyEmailOtp}
                      disabled={formData.emailOtp.length !== 6 || loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-green-600 font-medium">✓ Email verified successfully</p>
              )}
            </div>

            {/* Phone Verification */}
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Phone className="text-[#0B2A4A] mr-2" size={20} />
                  <span className="font-medium">Phone Verification</span>
                </div>
                {formData.isPhoneVerified && (
                  <CheckCircle className="text-green-500" size={20} />
                )}
              </div>
              <p className="text-sm text-gray-600 mb-3">+91{formData.leaderPhone}</p>
              
              {!formData.isPhoneVerified ? (
                <div className="space-y-3">
                  <button
                    onClick={sendPhoneOtp}
                    disabled={loading}
                    className="w-full bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send SMS OTP'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={formData.phoneOtp}
                      onChange={(e) => handleInputChange('phoneOtp', e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength="6"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1D5B9B]"
                    />
                    <button
                      onClick={verifyPhoneOtp}
                      disabled={formData.phoneOtp.length !== 6 || loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-green-600 font-medium">✓ Phone verified successfully</p>
              )}
            </div>

            {errors.emailOtp && (
              <p className="text-red-500 text-sm">{errors.emailOtp}</p>
            )}
            {errors.phoneOtp && (
              <p className="text-red-500 text-sm">{errors.phoneOtp}</p>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white rounded-lg transition-colors duration-200"
            >
              Next: Payment
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;