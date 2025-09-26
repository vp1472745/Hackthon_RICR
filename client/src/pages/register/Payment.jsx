import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, CreditCard, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

const Payment = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // Load registration data from localStorage
    const savedData = localStorage.getItem('registrationData');
    if (!savedData) {
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

  // Countdown timer effect - starts after payment is completed
  useEffect(() => {
    if (paymentCompleted && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (paymentCompleted && countdown === 0) {
      navigate('/login');
    }
  }, [paymentCompleted, countdown, navigate]);

  const handlePayment = () => {
    // Simulate payment processing
    setPaymentCompleted(true);
  };

  const handleBack = () => {
    navigate('/verification');
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
        <ProgressBar currentStep={3} />
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#0B2A4A] rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment</h2>
            <p className="text-gray-600">
              Complete your registration with payment
            </p>
          </div>

          {!paymentCompleted ? (
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
                {registrationData.team && (
                  <p className="text-sm font-bold text-green-600">Team Code: {registrationData.team.teamCode}</p>
                )}
              </div>

              {/* Payment Button */}
              <div className="text-center">
                <button
                  onClick={handlePayment}
                  className="bg-[#0B2A4A] hover:bg-[#0d2d4f] text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-200 flex items-center gap-3 mx-auto"
                >
                  <CreditCard className="w-5 h-5" />
                  Payment
                </button>
              </div>

              {/* Back Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              </div>
            </div>
          ) : (
            /* Success Screen with Countdown */
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
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
                onClick={() => navigate('/login')}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Go to Dashboard Now
              </button>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo payment system. In production, this would integrate with real payment gateways.
            </p>
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Payment;