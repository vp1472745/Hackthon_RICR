// src/pages/payment/Payment.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle, CreditCard, Clock, UploadCloud, XCircle } from 'lucide-react';
import { authAPI } from '../../configs/api.js';
import { useNavigate } from 'react-router-dom';
import ProgressBar from './ProgressBar.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QRCode from 'qrcode';

/*
  CONFIG - Update these with your actual payee details
*/
const PAYEE_VPA = 'eazypay.WDQMX31RXF4I1DT@icici';       // <-- replace with real VPA if needed
const PAYEE_NAME = 'Nav Kalpana';         // <-- merchant name
const AMOUNT = '1500';                    // fixed fee ₹1,500
const TRANSACTION_NOTE = 'Nav Kalpana Fee';

const buildUpiLink = ({ vpa = PAYEE_VPA, name = PAYEE_NAME, amount = AMOUNT, note = TRANSACTION_NOTE, tr = '' }) => {
  const params = new URLSearchParams({
    pa: vpa,
    pn: name,
    am: amount,
    cu: 'INR',
    tn: note,
    tr,
  });
  return `upi://pay?${params.toString()}`;
};

// Optional: intent link for Google Pay (Android)
const buildIntentForPackage = (upiLink, packageName) => {
  return `intent:${upiLink}#Intent;package=${packageName};scheme=upi;end`;
};

const Payment = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  // form state
  const [utr, setUtr] = useState('');
  const utrPattern = /^\d{12,16}$/;
  const isUtrValid = utrPattern.test(utr.trim());
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState(null);

  // unique reference - prefer server-generated; using registrationData._id fallback
  const referenceId = useMemo(() => {
    if (!registrationData) return `PAY-${Date.now()}`;
    const idpart = registrationData._id ? registrationData._id.slice(-8) : Date.now().toString().slice(-8);
    return `PAY-${idpart}`;
  }, [registrationData]);

  useEffect(() => {
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

  // generate QR (data URL) when registrationData or referenceId available
  useEffect(() => {
    const createQr = async () => {
      try {
        const upiUri = buildUpiLink({
          vpa: PAYEE_VPA,
          name: PAYEE_NAME,
          amount: AMOUNT,
          note: `${TRANSACTION_NOTE} Ref:${referenceId}`,
          tr: referenceId,
        });
        const url = await QRCode.toDataURL(upiUri, { errorCorrectionLevel: 'H', type: 'image/png', margin: 1 });
        setQrDataUrl(url);
      } catch (err) {
        console.error('QR gen failed', err);
        setQrDataUrl(null);
      }
    };

    if (referenceId) createQr();
  }, [referenceId]);

  // Removed countdown timer after payment submission as per request

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Screenshot size should be less than 5 MB');
      return;
    }
    setScreenshotFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleRemoveImage = () => {
    setScreenshotFile(null);
    setPreviewUrl(null);
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    const utrTrimmed = utr.trim();
    // UTR validation: 12-16 digits, all numbers
    const utrPattern = /^\d{12,16}$/;
    if (!utrTrimmed || !utrPattern.test(utrTrimmed)) {
      toast.error('Please enter a valid UPI Transaction ID (UTR) — 12 to 16 digits.');
      return;
    }
    if (!registrationData) {
      toast.error('Registration data missing. Please register first.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      const teamId = registrationData.team?._id;
      console.log('Submitting payment with teamId:', teamId);
      if (!teamId) {
        toast.error('Team ID is missing. Please contact support or try again.');
        setLoading(false);
        return;
      }
      formData.append('teamId', teamId);
      formData.append('name', registrationData.fullName || registrationData.name);
      formData.append('email', registrationData.email);
      formData.append('phone', registrationData.phone);
      formData.append('referenceId', referenceId);
      formData.append('transactionId', utrTrimmed);
      if (screenshotFile) formData.append('screenshot', screenshotFile);

      await authAPI.submitPayment(formData, { timeout: 30000 });
      toast.success('Thank you for registering for Nav Kalpana! Your payment is pending super admin verification. You will receive your User ID and Password by email within 24 hours after super admin approval.');
      setPaymentSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Failed to submit payment proof');
    } finally {
      setLoading(false);
    }
  };

  // open UPI app (mobile). app param: 'googlepay'|'phonepe'|'paytm'
  const openUpiApp = (app) => {
    const upi = buildUpiLink({ tr: referenceId });
    const packages = {
      googlepay: 'com.google.android.apps.nbu.paisa.user',
      phonepe: 'com.phonepe.app',
      paytm: 'net.one97.paytm',
    };
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const packageName = packages[app];

    if (!isMobile) {
      toast.info('UPI app links work on mobile. Please scan the QR with your UPI app.');
      return;
    }

    try {
      if (isAndroid && packageName) {
        const intentUrl = buildIntentForPackage(upi, packageName);
        window.location.href = intentUrl;
        // fallback to generic upi link after a short delay
        setTimeout(() => {
          window.location.href = upi;
        }, 600);
      } else {
        // iOS (or unsupported Android browsers)
        window.location.href = upi;
      }
    } catch (err) {
      toast.error('Could not open UPI app. Please scan QR manually.');
    }
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
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
          </div>

          {!paymentSubmitted ? (
            <form onSubmit={handleSubmitProof} className="space-y-6">
              <div className="flex items-center justify-between bg-blue-100 border border-blue-200 rounded-xl px-6 py-4">
                <div>
                  <h4 className="font-semibold text-[#0B2A4A]">Registration Fee</h4>
                  <p className="text-xs text-gray-500">Non-refundable</p>
                </div>
                <span className="text-2xl font-bold text-[#0B2A4A]">₹{AMOUNT}</span>
              </div>

              <div className="flex flex-col items-center bg-gray-50 rounded-xl px-5 py-6 border border-blue-200">
                <h4 className="font-semibold text-gray-700 mb-2">Scan & Pay</h4>

                {/* dynamic QR (dataURL) */}
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt={`UPI QR ₹${AMOUNT}`} className="w-48 h-48 border-2 border-blue-200 rounded-lg object-cover" />
                ) : (
                  <div className="w-48 h-48 flex items-center justify-center border-2 border-blue-200 rounded-lg bg-white">
                    <span className="text-sm text-gray-500">Generating QR...</span>
                  </div>
                )}

                <p className="text-sm text-gray-600 mb-2 mt-3 text-center">
                  Scan the QR with Google Pay / PhonePe / Paytm. <br />
                  <span className="font-semibold">Amount will be pre-filled to ₹{AMOUNT} (if your app supports it).</span>
                </p>

                {/* UPI app buttons removed as requested */}

                <div className="mt-3 text-xs text-gray-500 text-center">
                  <strong>Reference ID:</strong>{' '}
                  <span className="font-mono">{referenceId}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl px-5 py-4">
                <h4 className="font-semibold text-gray-700 mb-2">Enter Payment Details</h4>

                <label className="block text-sm text-gray-700 mb-1">UPI Transaction ID (UTR)</label>
                <input
                  type="text"
                  value={utr}
                  onChange={(e) => setUtr(e.target.value)}
                  placeholder="Example: 123456789012"
                  className={`w-full rounded-lg border px-4 py-2 mb-3 ${utr.length > 0 && !isUtrValid ? 'border-red-500 focus:border-red-600 outline-red-500' : ''}`}
                />
                {utr.length > 0 && !isUtrValid && (
                  <div className="text-xs text-red-600 mb-2">Enter a valid UPI Transaction ID (12-16 digits)</div>
                )}

                <label className="block text-sm text-gray-700 mb-1">Upload Screenshot (optional but recommended)</label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer bg-white border rounded-lg px-4 py-2">
                    <UploadCloud className="w-4 h-4" />
                    <span className="text-sm">Choose File</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                  {previewUrl && (
                    <div className="relative">
                      <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-md border" />
                      <button type="button" onClick={handleRemoveImage} className="absolute -top-2 -right-2 bg-white rounded-full shadow p-1 hover:bg-red-100">
                        <XCircle className="w-5 h-5 text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={loading || !utr.trim() || !screenshotFile}
                  className="bg-[#0B2A4A] hover:bg-[#14345a] text-white px-8 py-3 rounded-xl font-semibold text-lg flex items-center gap-2 shadow-md transition disabled:opacity-60"
                >
                  <CreditCard className="w-5 h-5" />
                  {loading ? 'Submitting...' : "I've Paid — Submit Proof"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col items-center py-8">
              <CheckCircle className="w-14 h-14 text-blue-500 mb-3" />
              <h3 className="text-xl font-bold text-blue-700 mb-1">Thank you for registering for Nav Kalpana!</h3>
              <p className="text-gray-600 mb-4 text-center">
                You will receive your login credentials by email within <span className="font-semibold">24 hours</span> after admin approval.<br />
                <span className="font-semibold">You cannot access your dashboard until your payment is unverified.</span>
              </p>
              <div className="flex items-center gap-2 bg-blue-100 rounded-lg px-4 py-2 mb-5">
                <Clock className="w-5 h-5 text-blue-700" />
                <span className="text-blue-800 text-sm">
                  Please wait for admin to verify your payment.
                </span>
              </div>
              <button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition">
                Go to Login
              </button>
            </div>
          )}

         
        </div>
      </div>
    </div>
  );
};

export default Payment;
