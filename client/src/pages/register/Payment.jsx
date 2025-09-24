import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, CreditCard, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { authAPI } from '../../configs/api.js';

const Payment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    leaderName: '',
    leaderEmail: '',
    leaderPhone: '',
    paymentMethod: 'phonepe',
    upiId: '',
    paymentStatus: 'pending', // pending, processing, success, failed
    transactionId: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load data from localStorage
    const savedData = JSON.parse(localStorage.getItem('registrationData') || '{}');
    if (!savedData.leaderEmail || !savedData.isEmailVerified || !savedData.isPhoneVerified) {
      // Redirect to previous steps if verification not completed
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

  // Handle payment
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
      // Generate transaction ID
      const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      // Call backend API to complete registration
      const response = await authAPI.completeRegistration({
        email: formData.leaderEmail,
        paymentMethod: formData.paymentMethod,
        upiId: formData.upiId,
        transactionId: transactionId
      });

      if (response.data.success) {
        const completedData = { 
          ...formData, 
          paymentStatus: 'success',
          transactionId: response.data.user.transactionId,
          registrationStatus: response.data.user.registrationStatus
        };
        
        setFormData(completedData);
        
        // Update localStorage with final data
        localStorage.setItem('registrationData', JSON.stringify(completedData));
        
        alert('🎉 Registration completed successfully! Welcome to FutureMaze!');
        
        // Optional: Redirect to dashboard or success page after delay
        setTimeout(() => {
          navigate('/user-dashboard'); // or wherever you want to redirect
        }, 2000);
      }
    } catch (error) {
      console.error('Payment/Registration error:', error);
      
      setFormData(prev => ({ ...prev, paymentStatus: 'failed' }));
      
      const errorMessage = error.response?.data?.message || 'Payment failed. Please try again.';
      alert(`Payment failed: ${errorMessage}`);
      
      // Clear payment status to allow retry
      setTimeout(() => {
        setFormData(prev => ({ ...prev, paymentStatus: 'pending' }));
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    // Save current data before going back
    localStorage.setItem('registrationData', JSON.stringify(formData));
    navigate('/register/verification');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B2A4A] mb-2">
            FutureMaze Registration
          </h1>
          <p className="text-gray-600">Step 3 of 3: Payment</p>
        </div>

        {/* Progress Bar */}
        <ProgressBar currentStep={formData.paymentStatus === 'success' ? 4 : 3} />

        {/* Payment Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="space-y-6">
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

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleBack}
              disabled={formData.paymentStatus === 'processing'}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>

            {formData.paymentStatus === 'success' && (
              <button
                onClick={() => navigate('/')}
                className="flex items-center px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
              >
                Go to Home
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;