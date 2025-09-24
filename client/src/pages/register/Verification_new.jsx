import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Shield, Mail, Phone, RefreshCw, Clock, CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [countdown, setCountdown] = useState(10);

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

  // Countdown timer effect for payment page
  useEffect(() => {
    if (showPayment && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (showPayment && countdown === 0) {
      navigate('/leader-dashboard');
    }
  }, [showPayment, countdown, navigate]);

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
    
    // Show toast for validation errors
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(`❌ ${firstError}`);
    }
    
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
      
      toast.success(`✅ ${type === 'email' ? 'Email' : 'Phone'} OTP resent successfully!`);
    } catch (error) {
      console.error(`Resend ${type} OTP error:`, error);
      toast.error(`❌ Failed to resend ${type} OTP. Please try again.`);
    } finally {
      setResending(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleVerify = async () => {
    if (!validateForm() || !registrationData) {
      if (!registrationData) {
        toast.error('❌ Registration data not found. Please restart the registration process.');
        navigate('/register');
      }
      return;
    }
    
    setLoading(true);
    
    // Debug: Log the data being sent
    console.log('Registration data being sent:', {
      fullName: registrationData.fullName,
      email: registrationData.email,
      phone: registrationData.phone,
      emailOTP: formData.emailOTP,
      phoneOTP: formData.phoneOTP
    });
    
    try {
      // Call backend API to verify OTPs and complete registration
      const response = await authAPI.register({
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
        emailOTP: formData.emailOTP,
        phoneOTP: formData.phoneOTP
      });
      
      // Debug: Log the response
      console.log('Registration response:', response);

      if (response.data && (response.status === 200 || response.status === 201)) {
        // Store team information
        const teamData = {
          ...registrationData,
          team: response.data.team,
          user: response.data.user,
          registrationComplete: true
        };
        
        localStorage.setItem('registrationData', JSON.stringify(teamData));
        
        // Show success message
        const teamCode = response.data.team?.teamCode || 'Unknown';
        toast.success(`🎉 Registration successful! Team created: ${teamCode}`);
        
        // Mark verification as complete
        setVerificationComplete(true);
      } else {
        toast.error('❌ Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error.response?.data) {
        const errorMessage = error.response.data.message || 'Unknown error occurred';
        
        // Handle specific errors - ensure errorMessage is a string
        if (typeof errorMessage === 'string' && errorMessage.includes('Email OTP')) {
          setErrors(prev => ({ ...prev, emailOTP: errorMessage }));
        } else if (typeof errorMessage === 'string' && errorMessage.includes('Phone OTP')) {
          setErrors(prev => ({ ...prev, phoneOTP: errorMessage }));
        } else {
          toast.error(`❌ Error: ${errorMessage}`);
        }
      } else if (error.response?.status === 400) {
        toast.error('❌ Invalid OTP. Please check your OTPs and try again.');
      } else if (error.message) {
        toast.error(`❌ Network Error: ${error.message}`);
      } else {
        toast.error('❌ Verification failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/register');
  };

  const handleNext = () => {
    setShowPayment(true);
    setCountdown(10); // Reset countdown to 10 seconds
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
              {showPayment ? <CreditCard className="w-8 h-8 text-white" /> : verificationComplete ? <CheckCircle className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {showPayment ? 'Payment' : verificationComplete ? 'Verification Complete!' : 'Verify Your Details'}
            </h2>
            <p className="text-gray-600">
              {showPayment 
                ? 'Complete your registration with payment processing' 
                : verificationComplete 
                  ? 'Your verification is complete. Proceed to payment.' 
                  : 'We\'ve sent OTPs to your email and phone number. Please enter them below to complete verification.'
              }
            </p>
          </div>

          {showPayment ? (
            /* Payment Section with Countdown */
            <div className="space-y-6">
              {/* Registration Fee */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <h4 className="font-semibold text-[#0B2A4A] mb-2">Registration Fee</h4>
                <p className="text-3xl font-bold text-[#0B2A4A]">₹1,000</p>
                <p className="text-sm text-gray-600 mt-2">Non-refundable registration fee</p>
              </div>

              {/* Team Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Registration Details:</h4>
                <p className="text-sm text-gray-600">Name: {registrationData.fullName}</p>
                <p className="text-sm text-gray-600">Email: {registrationData.email}</p>
                <p className="text-sm text-gray-600">Phone: +91 {registrationData.phone}</p>
              </div>

              {/* Success and Countdown */}
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Processing Complete!</h3>
                <p className="text-gray-600 mb-6">
                  Registration completed successfully! Welcome to FutureMaze by RICR!
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-semibold">Auto-redirecting in</span>
                  </div>
                  <div className="text-4xl font-bold text-blue-600">{countdown}</div>
                  <p className="text-sm text-blue-700 mt-2">Redirecting to Leader Dashboard...</p>
                </div>

                <button
                  onClick={() => navigate('/leader-dashboard')}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Go to Dashboard Now
                </button>
              </div>
            </div>
          ) : (
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
          )}

          {!showPayment && (
            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleBack}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              
              {verificationComplete ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next: Payment
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
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
              )}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> OTPs are valid for 5 minutes. If you don't receive them, please check your spam folder or click the resend button.
            </p>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Verification;