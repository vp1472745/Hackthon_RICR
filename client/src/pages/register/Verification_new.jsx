import React, { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import ProgressBar from "./ProgressBar.jsx";
import { authAPI } from "../../configs/api.js";

const Verification = () => {
  const navigate = useNavigate();
  const [registrationData, setRegistrationData] = useState(null);
  const [formData, setFormData] = useState({
    emailOTP: "",
    phoneOTP: "",
  });
  const [errors, setErrors] = useState({});
  const [resending, setResending] = useState({ email: false, phone: false });
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailTimer, setEmailTimer] = useState(60);
  const [phoneTimer, setPhoneTimer] = useState(60);

  useEffect(() => {
    const savedData = sessionStorage.getItem("registrationData");
    if (!savedData) {
      navigate("/register");
      return;
    }

    try {
      const parsedData = JSON.parse(savedData);
      setRegistrationData(parsedData);
    } catch (error) {
      console.error("Error parsing registration data:", error);
      navigate("/register");
    }
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmailTimer((prev) => (prev > 0 ? prev - 1 : 0));
      setPhoneTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOTP.trim()) {
      newErrors.emailOTP = "Email OTP is required";
    } else if (formData.emailOTP.length !== 6) {
      newErrors.emailOTP = "OTP must be 6 digits";
    }

    if (!formData.phoneOTP.trim()) {
      newErrors.phoneOTP = "Phone OTP is required";
    } else if (formData.phoneOTP.length !== 6) {
      newErrors.phoneOTP = "OTP must be 6 digits";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(` ${firstError}`);
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 6);
    setFormData((prev) => ({ ...prev, [field]: numericValue }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resendOTP = async (type) => {
    if (!registrationData) return;

    if (
      (type === "email" && emailTimer > 0) ||
      (type === "phone" && phoneTimer > 0)
    )
      return;

    setResending((prev) => ({ ...prev, [type]: true }));

    try {
      await authAPI.sendOTP({
        fullName: registrationData.fullName,
        email: registrationData.email,
        phone: registrationData.phone,
      });

      toast.success(
        `${type === "email" ? "Email" : "Phone"} OTP resent successfully!`
      );
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
        toast.error(
          " Registration data not found. Please restart the registration process."
        );
        navigate("/register");
      }
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({
        fullName: registrationData.fullName,
        email: registrationData.email.toLowerCase(),
        phone: registrationData.phone,
        emailOTP: formData.emailOTP,
        phoneOTP: formData.phoneOTP,
      });

      if (
        response.data &&
        (response.status === 200 || response.status === 201)
      ) {
        const teamData = {
          ...registrationData,
          team: response.data.team,
          user: response.data.user,
          registrationComplete: true,
        };

        sessionStorage.setItem("registrationData", JSON.stringify(teamData));
        setVerificationComplete(true);
      } else {
        toast.error(" Invalid response from server. Please try again.");
      }
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setShowPayment(true);
    navigate("/register/payment");
  };

  if (!registrationData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 md:h-32 md:w-32 border-b-2 border-[#0B2A4A] mx-auto"></div>
          <p className="mt-4 text-gray-600 text-sm md:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  if (verificationComplete && !showPayment) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md w-full max-w-md mx-auto">
          <div className="text-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
              Verification Successful!
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Your details have been verified successfully
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="space-y-2 text-sm md:text-base">
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Name:</span>
                <span className="text-gray-800">
                  {registrationData.fullName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800 break-all">
                  {registrationData.email.toLolwerCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-medium">Phone:</span>
                <span className="text-gray-800">
                  +91 {registrationData.phone}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2 mt-2">
                <span className="text-gray-600 font-medium">Fee:</span>
                <span className="text-gray-800 font-bold">₹1500</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-all font-medium text-sm md:text-base"
          >
            Next: Make Payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-6 md:mb-8">
          <ProgressBar currentStep={2} />
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg md:shadow-xl p-4 md:p-8">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="flex items-center justify-center mb-3">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-[#0B2A4A]" />
            </div>
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
              Verify Your Details
            </h2>
            {/* <p className="text-gray-600 text-sm md:text-base">
              We've sent OTPs to your email and phone number. Please enter them
              below to complete verification.
            </p> */}
            <p className="text-gray-600 text-sm md:text-base">
              You will receive the OTP from the <span className="font-medium">Raj Institute of Coding and
              Robotics</span>, and a confirmation email from{" "}
              <span className="font-medium">contact@ricr.in</span>.
            </p>
          </div>

          {/* OTP Forms */}
          <div className="space-y-4 md:space-y-6">
            {/* Email OTP Section */}
            <div className="bg-gray-50 rounded-lg p-4 md:p-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center mb-1">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-500" />
                  <span className="text-sm md:text-base">
                    Email Verification
                  </span>
                </div>
                <span className="text-xs md:text-sm text-gray-600 break-all">
                  OTP sent to: {registrationData.email}
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.emailOTP}
                    onChange={(e) =>
                      handleInputChange("emailOTP", e.target.value)
                    }
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm md:text-base ${
                      errors.emailOTP ? "border-red-500" : "border-gray-300"
                    }`}
                    maxLength={6}
                  />
                  {errors.emailOTP && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.emailOTP}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => resendOTP("email")}
                  disabled={resending.email || emailTimer > 0}
                  className="px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 text-sm md:text-base whitespace-nowrap min-w-[120px]"
                >
                  {resending.email ? (
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                  ) : emailTimer > 0 ? (
                    `Resend (${emailTimer}s)`
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </div>

            {/* Phone OTP Section */}
            <div className="bg-gray-50 rounded-lg p-4 md:p-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <div className="flex items-center mb-1">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 mr-2 text-green-500" />
                  <span className="text-sm md:text-base">
                    Phone Verification
                  </span>
                </div>
                <span className="text-xs md:text-sm text-gray-600">
                  OTP sent via WhatsApp to: +91 {registrationData.phone}
                </span>
              </label>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.phoneOTP}
                    onChange={(e) =>
                      handleInputChange("phoneOTP", e.target.value)
                    }
                    className={`w-full px-3 md:px-4 py-2 md:py-3 border rounded-lg focus:ring-2 focus:ring-[#0B2A4A] focus:border-transparent text-sm md:text-base ${
                      errors.phoneOTP ? "border-red-500" : "border-gray-300"
                    }`}
                    maxLength={6}
                  />
                  {errors.phoneOTP && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.phoneOTP}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => resendOTP("phone")}
                  disabled={resending.phone || phoneTimer > 0}
                  className="px-4 py-2 md:py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 text-sm md:text-base whitespace-nowrap min-w-[120px]"
                >
                  {resending.phone ? (
                    <RefreshCw className="w-4 h-4 animate-spin mx-auto" />
                  ) : phoneTimer > 0 ? (
                    `Resend (${phoneTimer}s)`
                  ) : (
                    "Resend OTP"
                  )}
                </button>
              </div>
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 font-medium text-sm md:text-base flex items-center justify-center"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                  Verify OTPs
                </>
              )}
            </button>
          </div>
        </div>

        {/* Back Button for Mobile */}
        <div className="mt-6 md:hidden">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center gap-2 text-gray-600 hover:text-gray-800 py-3 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Previous Step
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verification;
