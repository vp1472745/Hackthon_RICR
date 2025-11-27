import React from "react";
import { useEffect, useState } from "react";
import { subAdminAPI } from "../../../configs/api";
import PermissionWrapper from "../../../components/PermissionWrapper";
import usePermissions from "../../../hooks/usePermissions";
const PaymentManager = () => {
  // Debug: Log current admin and permissions
  const { permissions } = usePermissions();
  useEffect(() => {
    const adminUser = sessionStorage.getItem("adminUser");
    console.log("Current adminUser:", adminUser);
    console.log("Fetched permissions:", permissions);
  }, [permissions]);
  const { hasPermission } = usePermissions();
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1); // 1: View, 2: Verify/Reject, 3: Confirm
  const [viewOnly, setViewOnly] = useState(false); // NEW: whether modal is in view-only mode

  useEffect(() => {
    setLoading(true);
    // Fetch all payments (no stats API)
    subAdminAPI.getAllPayments()
      .then((r) => setPayments(r.data.payments || []))
      .catch(() => setError("Failed to fetch payments"))
      .finally(() => setLoading(false));
  }, []);

  const handleView = async (paymentId) => {
    setActionLoading(true);
    try {
      const res = await subAdminAPI.getPaymentById(paymentId);
      setSelectedPayment(res.data.payment);
      setCurrentStep(1);
      setViewOnly(true); // view-only mode: admin cannot go to review directly
    } catch {
      setError("Failed to fetch payment details");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReview = (payment) => {
    // Open modal in review mode directly (no extra fetch)
    setSelectedPayment(payment);
    setCurrentStep(2); // open at "Choose Action"
    setViewOnly(false);
    setRejectionMessage("");
  };

  const handleVerify = async (paymentId) => {
    setActionLoading(true);
    try {
      await subAdminAPI.verifyPayment(paymentId);
      setPayments(
        payments.map((p) =>
          p._id === paymentId ? { ...p, status: "Verified" } : p
        )
      );
      resetModal();
    } catch {
      setError("Failed to verify payment");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (paymentId) => {
    setActionLoading(true);
    try {
      await subAdminAPI.rejectPayment(paymentId, rejectionMessage);
      setPayments(
        payments.map((p) =>
          p._id === paymentId ? { ...p, status: "Rejected" } : p
        )
      );
      resetModal();
    } catch {
      setError("Failed to reject payment");
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
  };

  return (
    <PermissionWrapper permission="seePaymentStats">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Payment Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and verify team payments efficiently
            </p>
          </div>

          {/* Stats Overview */}
          <PermissionWrapper permission="seePaymentStats">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-blue-600">
                  {payments.length}
                </div>
                <div className="text-gray-600">Total Payments</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-yellow-600">
                  {payments.filter((p) => p.status === "Pending").length}
                </div>
                <div className="text-gray-600">Pending Review</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-green-600">
                  {payments.filter((p) => p.status === "Verified").length}
                </div>
                <div className="text-gray-600">Verified</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-2xl font-bold text-red-600">
                  {payments.filter((p) => p.status === "Rejected").length}
                </div>
                <div className="text-gray-600">Rejected</div>
              </div>
            </div>
          </PermissionWrapper>

          {/* Payments Table */}
          <PermissionWrapper permission="viewPaymentDetails">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
                  <div className="text-red-800 font-semibold">Error</div>
                  <div className="text-red-600">{error}</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Team Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr
                          key={payment._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-600">{payment.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-gray-900">{payment.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                payment.status
                              )}`}
                            >
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <PermissionWrapper permission="viewPaymentDetails">
                                <button
                                  onClick={() => handleView(payment._id)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                  👁️ View
                                </button>
                              </PermissionWrapper>
                              <PermissionWrapper permission="reviewPayments">
                                <button
                                  onClick={() => handleOpenReview(payment)}
                                  disabled={actionLoading}
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                  ✏️ Review
                                </button>
                              </PermissionWrapper>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </PermissionWrapper>

          {/* Modal */}
          {selectedPayment && (
            <PermissionWrapper permission="viewPaymentDetails">
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
                  {/* Header */}
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Payment Review
                    </h3>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Step 1: View Details */}
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <div className="mt-1">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  selectedPayment.status
                                )}`}
                              >
                                {selectedPayment.status}
                              </span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Name
                            </label>
                            <div className="mt-1 text-sm text-gray-900">
                              {selectedPayment.name}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Email
                            </label>
                            <div className="mt-1 text-sm text-gray-900">
                              {selectedPayment.email}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Reference ID
                            </label>
                            <div className="mt-1 text-sm text-gray-900">
                              {selectedPayment.referenceId}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Transaction ID
                            </label>
                            <div className="mt-1 text-sm text-gray-900">
                              {selectedPayment.transactionId}
                            </div>
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Screenshot
                            </label>
                            <div className="mt-1">
                              {selectedPayment.screenshot ? (
                                <a
                                  href={selectedPayment.screenshot}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-600 underline"
                                >
                                  Open Screenshot
                                </a>
                              ) : (
                                <span className="text-sm text-gray-500">
                                  No screenshot provided
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                          <button
                            onClick={resetModal}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Close
                          </button>

                          {/* Only show Next Step if NOT viewOnly */}
                          {!viewOnly && (
                            <PermissionWrapper permission="reviewPayments">
                              <button
                                onClick={() => setCurrentStep(2)}
                                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Next Step
                              </button>
                            </PermissionWrapper>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Choose Action */}
                    {currentStep === 2 && (
                      <PermissionWrapper permission="reviewPayments">
                        <div className="space-y-6">
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                              <div className="flex-shrink-0">💡</div>
                              <div className="ml-3">
                                <h4 className="text-sm font-medium text-blue-800">
                                  Review Guidelines
                                </h4>
                                <div className="mt-1 text-sm text-blue-700">
                                  <p>
                                    • Verify payment details match the team
                                    information
                                  </p>
                                  <p>• Check payment amount and transaction ID</p>
                                  <p>• Provide clear reason if rejecting</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <PermissionWrapper permission="verifyPayments">
                              <button
                                onClick={() => {
                                  setSelectedPayment((prev) => ({
                                    ...prev,
                                    action: "approve",
                                  }));
                                  setCurrentStep(3);
                                }}
                                className="p-4 border-2 border-green-200 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-left"
                              >
                                <div className="text-green-600 font-semibold">
                                  Approve Payment
                                </div>
                                <div className="text-green-500 text-sm mt-1">
                                  Mark this payment as verified and approved
                                </div>
                              </button>
                            </PermissionWrapper>

                            <PermissionWrapper permission="rejectPayments">
                              <button
                                onClick={() => {
                                  setSelectedPayment((prev) => ({
                                    ...prev,
                                    action: "reject",
                                  }));
                                  setCurrentStep(3);
                                }}
                                className="p-4 border-2 border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors text-left"
                              >
                                <div className="text-red-600 font-semibold">
                                  Reject Payment
                                </div>
                                <div className="text-red-500 text-sm mt-1">
                                  Payment requires correction or is invalid
                                </div>
                              </button>
                            </PermissionWrapper>
                          </div>

                          <div className="flex justify-between pt-4">
                            <button
                              onClick={() => setCurrentStep(1)}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Back
                            </button>
                            <button
                              onClick={resetModal}
                              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </PermissionWrapper>
                    )}

                    {/* Step 3: Confirmation */}
                    {currentStep === 3 && (
                      <PermissionWrapper permission={selectedPayment.action === "reject" ? "rejectPayments" : "verifyPayments"}>
                        <div className="space-y-6">
                          {selectedPayment.action === "reject" ? (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for Rejection *
                              </label>
                              <textarea
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={4}
                                value={rejectionMessage}
                                onChange={(e) =>
                                  setRejectionMessage(e.target.value)
                                }
                                placeholder="Please provide a clear reason for rejecting this payment..."
                              />
                              <div className="flex justify-end space-x-3 pt-4">
                                <button
                                  onClick={() => setCurrentStep(2)}
                                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Back
                                </button>
                                <button
                                  onClick={() =>
                                    handleReject(selectedPayment._id)
                                  }
                                  disabled={
                                    actionLoading || !rejectionMessage.trim()
                                  }
                                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                >
                                  {actionLoading
                                    ? "Processing..."
                                    : "Confirm Rejection"}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-4">
                              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <span className="text-green-600 text-xl">✓</span>
                              </div>
                              <div>
                                <h4 className="text-lg font-medium text-gray-900">
                                  Approve Payment?
                                </h4>
                                <p className="text-gray-600 mt-1">
                                  Are you sure you want to verify and approve this
                                  payment?
                                </p>
                              </div>
                              <div className="flex justify-center space-x-3 pt-4">
                                <button
                                  onClick={() => setCurrentStep(2)}
                                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Back
                                </button>
                                <button
                                  onClick={() =>
                                    handleVerify(selectedPayment._id)
                                  }
                                  disabled={actionLoading}
                                  className="px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                >
                                  {actionLoading
                                    ? "Processing..."
                                    : "Yes, Approve Payment"}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </PermissionWrapper>
                    )}
                  </div>
                </div>
              </div>
            </PermissionWrapper>
          )}
        </div>
      </div>
    </PermissionWrapper>
  );
};

export default PaymentManager;
