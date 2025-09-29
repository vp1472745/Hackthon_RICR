import React, { useState, useEffect } from 'react';
import { CheckCircle, CreditCard, Clock } from 'lucide-react';
import { authAPI } from '../../configs/api.js';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';

const Payment = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(100);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    // Load registration data from sessionStorage
    const savedData = sessionStorage.getItem('registrationData');
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

  const handlePayment = async () => {
    // Simulate payment processing

    //call an Backend Route to send email with login details

    setPaymentCompleted(true);

    await authAPI.sendCredentials({ email: registrationData.email, teamCode: registrationData.team.teamCode });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <ProgressBar currentStep={3} />

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
            <p className="text-gray-600">Secure your spot at FutureMaze by completing the payment below.</p>
          </div>

          {!paymentCompleted ? (
            <div className="space-y-7">
              {/* Registration Fee */}
              <div className="flex items-center justify-between bg-blue-100 border border-blue-200 rounded-xl px-6 py-4">
                <div>
                  <h4 className="font-semibold text-[#0B2A4A]">Registration Fee</h4>
                  <p className="text-xs text-gray-500">Non-refundable</p>
                </div>
                <span className="text-2xl font-bold text-[#0B2A4A]">₹1,500</span>
              </div>

              {/* Registration Details */}
              <div className="bg-gray-50 rounded-xl px-5 py-4">
                <h4 className="font-semibold text-gray-700 mb-2">Your Details</h4>
                <ul className="text-sm text-gray-700 space-y-1">

                  <li>
                    <span className="font-medium">Name:</span> {registrationData.fullName}
                  </li>
                  <li>
                    <span className="font-medium">Email:</span> {registrationData.email}
                  </li>
                  <li>
                    <span className="font-medium">Phone:</span> +91 {registrationData.phone}
                  </li>
                </ul>
              </div>

              {/* Payment Button */}
              <div className="flex flex-col items-center">
                <button
                  onClick={handlePayment}
                  className="bg-[#0B2A4A] hover:bg-[#14345a] cursor-pointer text-white px-8 py-3 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-md transition"
                >
                  <CreditCard className="w-5 h-5" />
                  Pay Now
                </button>

              </div>
            </div>
          ) : (
            // Payment Success
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="w-14 h-14 text-green-500 mb-3" />
              <h3 className="text-xl font-bold text-green-700 mb-1">Payment Successful!</h3>
              <p className="text-gray-600 mb-4 text-center">
                Welcome to FutureMaze! Your registration is complete.
              </p>
              <p className="text-blue-700 font-medium mb-4 text-center">
                Check your Email for Login Details and Instructions.
              </p>
              <div className="flex items-center gap-2 bg-blue-100 rounded-lg px-4 py-2 mb-5">
                <Clock className="w-5 h-5 text-blue-700" />
                <span className="text-blue-800 text-sm">
                  Redirecting to login in <span className="font-bold">{countdown}</span> seconds...
                </span>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-6 py-2 rounded-lg font-semibold transition"
              >
                Login Now
              </button>
            </div>
          )}

          <div className="mt-7 p-4 bg-blue-50 rounded-xl text-blue-900 text-xs text-center">
            <strong>Note:</strong> This is a demo payment page. In production, a real payment gateway would be integrated.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;