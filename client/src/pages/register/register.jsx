import React, { useState } from 'react';
import { CheckCircle, Circle, ArrowLeft, ArrowRight, User, Mail, Phone, CreditCard, Shield } from 'lucide-react';


const Register = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Leader Details
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    
    // Step 2: Verification
    emailOtp: '',
    phoneOtp: '',
    isEmailVerified: false,
    isPhoneVerified: false,
    
    // Step 3: Payment
    paymentMethod: 'phonepe',
    upiId: '',
    paymentStatus: 'pending', // pending, processing, success, failed
    transactionId: ''
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

  const validateStep1 = () => {
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

  const validateStep2 = () => {
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

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Send OTP functions
  const sendEmailOtp = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`OTP sent to ${formData.leaderEmail}`);
    } catch (error) {
      console.error('Failed to send email OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendPhoneOtp = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`OTP sent to +91${formData.leaderPhone}`);
    } catch (error) {
      console.error('Failed to send phone OTP:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP functions
  const verifyEmailOtp = async () => {
    if (formData.emailOtp.length === 6) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormData(prev => ({ ...prev, isEmailVerified: true }));
        alert('Email verified successfully!');
      } catch (error) {
        console.error('Email verification failed:', error);
        alert('Invalid OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const verifyPhoneOtp = async () => {
    if (formData.phoneOtp.length === 6) {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormData(prev => ({ ...prev, isPhoneVerified: true }));
        alert('Phone number verified successfully!');
      } catch (error) {
        console.error('Phone verification failed:', error);
        alert('Invalid OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle file upload
  const handlePayment = async () => {
    if (!formData.upiId.trim()) {
      setErrors({ upiId: 'UPI ID is required' });
      return;
    }

    const upiRegex = /^[\w.-]+@[\w.-]+$/;
    if (!upiRegex.test(formData.upiId)) {
      setErrors({ upiId: 'Please enter a valid UPI ID' });
      return;
    }

    setLoading(true);
    setFormData(prev => ({ ...prev, paymentStatus: 'processing' }));

    try {
      // Simulate payment gateway integration
      // In real implementation, this would call payment gateway API
      
      // Step 1: Initiate payment
      const paymentData = {
        amount: 1000,
        currency: 'INR',
        upiId: formData.upiId,
        paymentMethod: formData.paymentMethod,
        description: 'FutureMaze Hackathon Registration',
        customerName: formData.leaderName,
        customerEmail: formData.leaderEmail,
        customerPhone: formData.leaderPhone
      };

      console.log('Initiating payment:', paymentData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate successful payment
      const mockTransactionId = 'TXN' + Date.now();
      
      setFormData(prev => ({ 
        ...prev, 
        paymentStatus: 'success',
        transactionId: mockTransactionId 
      }));

      // Auto-complete registration after successful payment
      setTimeout(() => {
        alert(`Payment Successful! 🎉\nTransaction ID: ${mockTransactionId}\nRegistration completed successfully!`);
        // In real app, redirect to dashboard or success page
      }, 1000);

    } catch (error) {
      console.error('Payment failed:', error);
      setFormData(prev => ({ ...prev, paymentStatus: 'failed' }));
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const goToNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
          <p className="text-gray-600">
            Join the most exciting hackathon of 2025
          </p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={currentStep} />

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Step 1: Team Leader Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">
                Team Leader Information
              </h3>
              
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
          )}

          {/* Step 2: Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">
                Verify Your Contact Information
              </h3>

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
          )}

          {/* Step 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-[#0B2A4A] mb-4">
                Payment Gateway
              </h3>

              {/* Registration Fee */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-[#0B2A4A] mb-2">Registration Fee</h4>
                <p className="text-2xl font-bold text-[#0B2A4A]">₹1,000</p>
                <p className="text-sm text-gray-600">Non-refundable registration fee</p>
              </div>

              {/* Payment Status */}
              {formData.paymentStatus === 'processing' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0B2A4A] mr-3"></div>
                    <p className="text-yellow-800 font-medium">Processing payment...</p>
                  </div>
                  <p className="text-sm text-yellow-700 mt-2">
                    Please complete the payment in your {formData.paymentMethod} app
                  </p>
                </div>
              )}

              {formData.paymentStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="text-green-500 mr-3" size={24} />
                    <div>
                      <p className="text-green-800 font-medium">Payment Successful!</p>
                      <p className="text-sm text-green-700">Transaction ID: {formData.transactionId}</p>
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentStatus === 'failed' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">❌ Payment Failed</p>
                  <p className="text-sm text-red-700">Please try again with a different payment method</p>
                </div>
              )}

              {/* Payment Method Selection */}
              {formData.paymentStatus === 'pending' && (
                <>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#0B2A4A] mb-4">Select Payment Method</h4>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {[
                        { id: 'phonepe', name: 'PhonePe', color: 'bg-purple-100 border-purple-300' },
                        { id: 'paytm', name: 'Paytm', color: 'bg-blue-100 border-blue-300' },
                        { id: 'googlepay', name: 'Google Pay', color: 'bg-green-100 border-green-300' },
                        { id: 'upi', name: 'Other UPI', color: 'bg-gray-100 border-gray-300' }
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => handleInputChange('paymentMethod', method.id)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            formData.paymentMethod === method.id
                              ? 'border-[#0B2A4A] bg-[#0B2A4A] text-white'
                              : `${method.color} hover:border-[#1D5B9B]`
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-lg font-semibold">{method.name}</div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* UPI ID Input */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Enter Your UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.upiId}
                          onChange={(e) => handleInputChange('upiId', e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#1D5B9B] focus:border-transparent ${
                            errors.upiId ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="yourname@phonepe / yourname@paytm / yourname@upi"
                        />
                        {errors.upiId && (
                          <p className="text-red-500 text-sm mt-1">{errors.upiId}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the UPI ID linked to your {formData.paymentMethod} account
                        </p>
                      </div>

                      {/* Payment Button */}
                      <button
                        onClick={handlePayment}
                        disabled={loading || !formData.upiId.trim()}
                        className="w-full bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white py-4 px-6 rounded-lg transition-colors duration-200 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Processing Payment...
                          </div>
                        ) : (
                          `Pay ₹1,000 via ${formData.paymentMethod === 'phonepe' ? 'PhonePe' : 
                                           formData.paymentMethod === 'paytm' ? 'Paytm' : 
                                           formData.paymentMethod === 'googlepay' ? 'Google Pay' : 'UPI'}`
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-[#0B2A4A] mb-2">How it works:</h4>
                    <ol className="text-sm text-gray-700 space-y-1">
                      <li>1. Select your preferred payment method</li>
                      <li>2. Enter your UPI ID</li>
                      <li>3. Click "Pay" to send payment link to your app</li>
                      <li>4. Complete payment in your app</li>
                      <li>5. Registration will be automatically completed</li>
                    </ol>
                  </div>
                </>
              )}

              {/* Success Message */}
              {formData.paymentStatus === 'success' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h3>
                  <p className="text-gray-600 mb-4">
                    Welcome to FutureMaze by RICR! Your registration has been completed.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4 text-left max-w-md mx-auto">
                    <h4 className="font-semibold text-[#0B2A4A] mb-2">Registration Details:</h4>
                    <p className="text-sm text-gray-600">Name: {formData.leaderName}</p>
                    <p className="text-sm text-gray-600">Email: {formData.leaderEmail}</p>
                    <p className="text-sm text-gray-600">Phone: +91{formData.leaderPhone}</p>
                    <p className="text-sm text-gray-600">Transaction: {formData.transactionId}</p>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    You will receive Team ID and login credentials via email within 24 hours.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={goToPreviousStep}
              disabled={currentStep === 1 || formData.paymentStatus === 'processing'}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>

            {currentStep < 3 ? (
              <button
                onClick={goToNextStep}
                className="flex items-center px-6 py-2 bg-[#0B2A4A] hover:bg-[#1D5B9B] text-white rounded-lg transition-colors duration-200"
              >
                Next
                <ArrowRight size={16} className="ml-2" />
              </button>
            ) : formData.paymentStatus === 'success' ? (
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                Go to Home
                <ArrowRight size={16} className="ml-2" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
