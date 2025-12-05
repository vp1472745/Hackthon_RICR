// src/pages/admin/PaymentManager.jsx
import React, { useEffect, useState } from "react";
import { AdminAPI } from "../../../configs/api"; // keep your existing AdminAPI if present
import toast from "react-hot-toast";

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: View, 2: Choose, 3: Confirm, 4: Result
  const [viewOnly, setViewOnly] = useState(false);
  const [lastActionResult, setLastActionResult] = useState(null); // store backend response for result display
  const [imageModalOpen, setImageModalOpen] = useState(false); // state to control enlarged image modal
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await AdminAPI.getAllPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error("fetchPayments error", err);
      setError("Failed to fetch payments");
      toast.error("Failed to fetch payments");
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (paymentId) => {
    setActionLoading(true);
    try {
      const res = await AdminAPI.getPaymentById(paymentId);
      setSelectedPayment(res.data.payment);
      setCurrentStep(1);
      setViewOnly(true);
      setRejectionMessage("");
    } catch (err) {
      console.error("handleView", err);
      toast.error("Failed to load payment details");
    } finally {
      setActionLoading(false);
    }
  };

  // helper to update payments array immutably
  const updatePaymentStatusInList = (paymentId, newStatus) => {
    setPayments((prev) =>
      prev.map((p) => (p._id === paymentId ? { ...p, status: newStatus } : p))
    );
  };

  const handleVerify = async (paymentId) => {
    setActionLoading(true);
    try {
      // Send status: 'verified' (lowercase) for backend
      const body = { status: "verified" };
      const res = await AdminAPI.verifyPayment(paymentId, body);
      const data = res.data;
      if (data && (data.status === "success" || data.status === "warning")) {
        updatePaymentStatusInList(paymentId, "Verified");
        const emailSent = data.email?.sent;
        if (emailSent) {
          toast.success(
            "Payment verified — credentials emailed to participant."
          );
        } else if (data.email?.error) {
          toast.success(
            "Payment verified. But sending email failed — check logs."
          );
          toast.error(`Email error: ${data.email.error}`);
        } else {
          toast.success("Payment verified.");
        }
        resetModal();
      } else {
        toast.error(data?.message || "Unexpected response from server");
      }
    } catch (err) {
      console.error("handleVerify error", err);
      const msg = err?.response?.data?.message || "Failed to verify payment";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (paymentId) => {
    if (!rejectionMessage.trim()) {
      toast.error("Please provide a clear rejection reason.");
      return;
    }
    setActionLoading(true);
    try {
      // Send status: 'rejected' (lowercase) for backend
      const body = { status: "rejected", rejectionMessage };
      const res = await AdminAPI.verifyPayment(paymentId, body);
      const data = res.data;
      if (data && (data.status === "success" || data.status === "warning")) {
        updatePaymentStatusInList(paymentId, "Rejected");
        setLastActionResult(data); // store backend response for result display
        setCurrentStep(4); // show result step
        const emailSent = data.email?.sent;
        if (emailSent) {
          toast.success(
            data.message || "Payment rejected and user notified by email."
          );
        } else {
          toast.success(
            data.message ||
              "Payment rejected. Email sending failed — notify user manually."
          );
          if (data.email?.error)
            toast.error(`Email error: ${data.email.error}`);
        }
      } else {
        toast.error(data?.message || "Unexpected response from server");
      }
    } catch (err) {
      console.error("handleReject error", err);
      const msg = err?.response?.data?.message || "Failed to reject payment";
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Verified":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const resetModal = () => {
    setSelectedPayment(null);
    setRejectionMessage("");
    setCurrentStep(1);
    setViewOnly(false);
    setLastActionResult(null);
  };

  // Filter payments based on search and status
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      searchTerm === "" ||
      payment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.referenceId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || payment.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Payment Management
          </h1>
          
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-2">
          <div className="bg-white rounded-lg shadow px-4 py-2">
            <div className="text-xl sm:text-2xl font-bold flex items-baseline justify-between px-4">
              <span className="text-lg text-blue-400">Total payments</span>{" "}
              <span className="text-blue-700">{payments.length}</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-2">
            <div className="text-xl sm:text-2xl font-bold flex items-baseline justify-between px-4">
              <span className="text-lg text-yellow-400">Pending Review</span>{" "}
              <span className="text-yellow-700">
                {payments.filter((p) => p.status === "Pending").length}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-2">
            <div className="text-xl sm:text-2xl font-bold flex items-baseline justify-between px-4">
              <span className="text-lg text-green-400">Verified</span>{" "}
              <span className="text-green-700">
                {payments.filter((p) => p.status === "Verified").length}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow px-4 py-2">
            <div className="text-xl sm:text-2xl font-bold flex items-baseline justify-between px-4">
              <span className="text-lg text-red-400">Rejected</span>{" "}
              <span className="text-red-700">
                {payments.filter((p) => p.status === "Rejected").length}
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name, email, reference or transaction ID..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "Pending", "Verified", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? status === "All"
                      ? "bg-blue-600 text-white"
                      : status === "Pending"
                      ? "bg-yellow-600 text-white"
                      : status === "Verified"
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8 sm:p-12">
              <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex justify-center items-center p-6 sm:p-12">
              <div className="text-gray-500 text-center">
                <div className="text-lg mb-2">No payments found</div>
                <div className="text-sm">
                  Try adjusting your search or filter
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredPayments.map((payment) => (
                <div
                  key={payment._id}
                  className="bg-white rounded-lg shadow p-2 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex-1">
                    <div className="text-gray-600 text-sm sm:text-base font-medium">
                      {payment.name}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {payment.email}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500">
                      {payment.phone}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end justify-between w-full sm:w-auto">
                    <span
                      className={` px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                    <button
                      onClick={() => handleView(payment._id)}
                      disabled={actionLoading}
                      className="px-3 py-2 border border-gray-300 shadow-sm text-xs sm:text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black/70 bg-blur-2xl flex items-center justify-center z-50 p-3 sm:p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg md:max-w-2xl mx-2 sm:mx-4">
              <div className="px-4 sm:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Payment Review
                </h3>
                <div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(
                      selectedPayment.status
                    )}`}
                  >
                    {selectedPayment.status}
                  </span>{" "}
                </div>
              </div>

              <div className="p-4 sm:p-6">
                {/* Step 1 - View */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Left Side: Image */}
                      <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700">
                          Screenshot
                        </label>
                        <div className="mt-1">
                          {selectedPayment.screenshot ? (
                            <button
                              onClick={() => setImageModalOpen(true)}
                              className="focus:outline-none w-full"
                            >
                              <img
                                src={selectedPayment.screenshot}
                                alt="Payment Screenshot"
                                className="w-full h-auto rounded-md border cursor-pointer hover:opacity-90"
                              />
                            </button>
                          ) : (
                            <span className="text-sm text-gray-500">
                              No screenshot provided
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right Side: Details */}
                      <div className="flex flex-col space-y-4 md:col-span-2 md:mt-0 mt-4 md:ml-5">
                        <div className="flex gap-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Name :
                          </label>
                          <div className="text-sm text-gray-900">
                            {selectedPayment.name}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Email :
                          </label>
                          <div className="text-sm text-gray-900 break-all">
                            {selectedPayment.email}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Reference ID :
                          </label>
                          <div className="text-sm text-gray-900">
                            {selectedPayment.referenceId}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <label className="block text-sm font-medium text-gray-700">
                            UTR Number :
                          </label>
                          <div className="text-sm text-gray-900 break-all">
                            {selectedPayment.transactionId}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between pt-4 space-x-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setSelectedPayment((prev) => ({
                              ...prev,
                              action: "approve",
                            }));
                            setCurrentStep(3);
                          }}
                          className="px-4 py-2 border rounded-lg text-left text-green-700 hover:bg-green-50 "
                        >
                          Approve Payment
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayment((prev) => ({
                              ...prev,
                              action: "reject",
                            }));
                            setCurrentStep(3);
                          }}
                          className="px-4 py-2 border rounded-lg text-left text-red-700 hover:bg-red-50 "
                        >
                          Reject Payment
                        </button>
                      </div>
                      <button
                        onClick={resetModal}
                        className="px-4 py-2 text-blue-700 hover:bg-blue-50 border rounded-md text-sm sm:text-base"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3 - Confirm */}
                {currentStep === 3 && (
                  <div>
                    {selectedPayment.action === "reject" ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reason for Rejection *
                        </label>
                        <textarea
                          className="w-full border p-3 rounded-md text-sm sm:text-base"
                          rows={4}
                          value={rejectionMessage}
                          onChange={(e) => setRejectionMessage(e.target.value)}
                          placeholder="Provide clear reason..."
                        />
                        <div className="flex justify-end pt-4 space-x-3">
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="px-4 py-2 border rounded-md text-sm sm:text-base"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => handleReject(selectedPayment._id)}
                            disabled={actionLoading || !rejectionMessage.trim()}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm sm:text-base"
                          >
                            {actionLoading
                              ? "Processing..."
                              : "Confirm Rejection"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="flex flex-row items-center justify-center gap-2">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-100 flex items-center justify-center">
                            ✓
                          </div>
                          <h4 className="text-lg font-medium">
                            Approve Payment?
                          </h4>
                        </div>

                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                          Are you sure you want to verify and approve this
                          payment?
                        </p>
                        <div className="p-4 rounded-lg text-start mt-4">
                          <h4 className="text-sm font-medium text-blue-800">
                            Review Guidelines
                          </h4>
                          <div className="text-sm text-blue-700 mt-2">
                            <p>
                              • Verify payment details match the team
                              information
                            </p>
                            <p>• Check payment amount and transaction ID</p>
                            <p>• Provide a clear reason if rejecting</p>
                          </div>
                        </div>
                        <div className="flex justify-center mt-4 space-x-3">
                          <button
                            onClick={() => setCurrentStep(1)}
                            className="px-4 py-2 border rounded-md text-sm sm:text-base"
                          >
                            Back
                          </button>
                          <button
                            onClick={() => handleVerify(selectedPayment._id)}
                            disabled={actionLoading}
                            className="px-4 py-2 bg-green-600 text-white rounded-md text-sm sm:text-base"
                          >
                            {actionLoading
                              ? "Processing..."
                              : "Yes, Approve Payment"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 4 - Result (after rejection) */}
                {currentStep === 4 && lastActionResult && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                        ✗
                      </div>
                      <h4 className="text-lg font-medium text-red-700">
                        Payment Rejected
                      </h4>
                      <p className="text-gray-700 mt-2 text-sm sm:text-base">
                        {lastActionResult.message}
                      </p>
                    </div>
                    <div className="bg-gray-50 border p-4 rounded-lg">
                      <div className="mb-2">
                        <span className="font-semibold">Rejection Reason:</span>
                        <span className="ml-2 text-gray-800 text-sm sm:text-base">
                          {lastActionResult.payment?.rejectionReason ||
                            lastActionResult.payment?.rejectionMessage ||
                            "N/A"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Email Status:</span>
                        <span
                          className={`ml-2 text-sm sm:text-base ${
                            lastActionResult.email?.sent
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {lastActionResult.email?.sent ? "Sent" : "Failed"}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Email To:</span>
                        <span className="ml-2 text-gray-800 text-sm sm:text-base break-all">
                          {lastActionResult.email?.to}
                        </span>
                      </div>
                      {lastActionResult.email?.error && (
                        <div className="mt-2 text-red-600 text-sm">
                          <span className="font-semibold">Email Error:</span>{" "}
                          {lastActionResult.email.error}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button
                        onClick={resetModal}
                        className="px-4 py-2 bg-gray-700 text-white rounded-md text-sm sm:text-base"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal for Enlarged Image */}
        {selectedPayment?.screenshot && (
          <div
            onClick={() => setImageModalOpen(false)} // Click anywhere to close
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4 ${
              imageModalOpen ? "" : "hidden"
            }`}
          >
            {/* Stop click inside modal from closing */}
            <div
              className="relative bg-white rounded-lg shadow-lg max-w-md sm:max-w-lg md:max-w-2xl w-full p-3 sm:p-4 mx-2"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button at TOP */}
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-gray-700 hover:text-black text-xl font-bold z-50"
              >
                ✕
              </button>

              {/* IMAGE BELOW BUTTON */}
              <img
                src={selectedPayment.screenshot}
                alt="Enlarged Payment Screenshot"
                className="w-full h-auto max-h-[70vh] sm:max-h-[80vh] rounded-md object-contain mt-6 sm:mt-8"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManager;
