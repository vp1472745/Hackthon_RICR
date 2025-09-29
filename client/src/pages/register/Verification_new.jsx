import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Shield, Mail, Phone, RefreshCw, CheckCircle, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast} from 'react-toastify';

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
  const [resending, setResending] = useState({ email: false, phone: false });
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const [emailTimer, setEmailTimer] = useState(60); // Timer for email OTP resend
  const [phoneTimer, setPhoneTimer] = useState(60); // Timer for phone OTP resend

  useEffect(() => {
    // Get registration data from sessionStorage
    const savedData = sessionStorage.getItem('registrationData');
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

  useEffect(() => {
    // Start countdown timers on page load
    const interval = setInterval(() => {
      setEmailTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setPhoneTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
      toast.error(` ${firstError}`);
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

    if ((type === 'email' && emailTimer > 0) || (type === 'phone' && phoneTimer > 0)) return;

    setResending((prev) => ({ ...prev, [type]: true }));
    
    try {
      await authAPI.sendOTP({
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
      });
      
      toast.success(`${type === 'email' ? 'Email' : 'Phone'} OTP resent successfully!`);

      // Reset both timers when either button is clicked
      setEmailTimer(120);
      setPhoneTimer(120);
    } catch (error) {
      console.error(`Resend ${type} OTP error:`, error);
      toast.error(`Failed to resend ${type} OTP. Please try again.`);
    } finally {
      setResending((prev) => ({ ...prev, [type]: false }));
    }
  };

  const handleVerify = async () => {
    if (!validateForm() || !registrationData) {
      if (!registrationData) {
        toast.error(' Registration data not found. Please restart the registration process.');
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
        
        sessionStorage.setItem('registrationData', JSON.stringify(teamData));
        
        // Show success message
        const teamCode = response.data.team?.teamCode || 'Unknown';
    
        // Mark verification as complete
        setVerificationComplete(true);
      } else {
        toast.error(' Invalid response from server. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleNext = () => {
    setShowPayment(true);
    navigate('/register/payment'); // Navigate to the payment page
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

  if (verificationComplete && !showPayment) {
    return (
      <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-4">Verification Successful</h2>
          <p className="text-gray-700 mb-2"><strong>Name:</strong> {registrationData.fullName}</p>
          <p className="text-gray-700 mb-2"><strong>Email:</strong> {registrationData.email}</p>
          <p className="text-gray-700 mb-2"><strong>Phone:</strong> {registrationData.phone}</p>
          <p className="text-gray-700 mb-4"><strong>Fee:</strong> ₹1500</p>
          <button
            onClick={handleNext}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
          >
            Next: Make Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={2} />
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Verify Your Details</h2>
            <p className="text-gray-600">We've sent OTPs to your email and phone number. Please enter them below to complete verification.</p>
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
                  disabled={resending.email || emailTimer > 0}
                  className="px-4 py-3 bg-blue-500 text-white cursor-pointer rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {emailTimer > 0 ? `Resend in ${emailTimer}s` : 'Resend OTP'}
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
                  disabled={resending.phone || phoneTimer > 0}
                  className="px-4 py-3 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {phoneTimer > 0 ? `Resend in ${phoneTimer}s` : 'Resend OTP'}
                </button>
              </div>
              {errors.phoneOTP && <p className="text-red-500 text-sm mt-1">{errors.phoneOTP}</p>}
            </div>
            <button
              onClick={handleVerify}
              className="w-full bg-green-500 cursor-pointer text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-all"
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Verifying...' : 'Verify OTPs'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;