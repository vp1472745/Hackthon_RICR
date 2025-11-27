// src/pages/admin/PaymentManager.jsx
import React, { useEffect, useState } from 'react';
import { AdminAPI } from '../../../configs/api'; // keep your existing AdminAPI if present
import toast from 'react-hot-toast';

const PaymentManager = () => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [rejectionMessage, setRejectionMessage] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: View, 2: Choose, 3: Confirm, 4: Result
  const [viewOnly, setViewOnly] = useState(false);
  const [lastActionResult, setLastActionResult] = useState(null); // store backend response for result display

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await AdminAPI.getAllPayments();
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error('fetchPayments error', err);
      setError('Failed to fetch payments');
      toast.error('Failed to fetch payments');
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
      setRejectionMessage('');
    } catch (err) {
      console.error('handleView', err);
      toast.error('Failed to load payment details');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenReview = (payment) => {
    setSelectedPayment(payment);
    setCurrentStep(2);
    setViewOnly(false);
    setRejectionMessage('');
  };

  // helper to update payments array immutably
  const updatePaymentStatusInList = (paymentId, newStatus) => {
    setPayments(prev => prev.map(p => (p._id === paymentId ? { ...p, status: newStatus } : p)));
  };

  const handleVerify = async (paymentId) => {
    setActionLoading(true);
    try {
      // Send status: 'verified' (lowercase) for backend
      const body = { status: 'verified' };
      const res = await AdminAPI.verifyPayment(paymentId, body);
      const data = res.data;
      if (data && (data.status === 'success' || data.status === 'warning')) {
        updatePaymentStatusInList(paymentId, 'Verified');
        const emailSent = data.email?.sent;
        if (emailSent) {
          toast.success('Payment verified — credentials emailed to participant.');
        } else if (data.email?.error) {
          toast.success('Payment verified. But sending email failed — check logs.');
          toast.error(`Email error: ${data.email.error}`);
        } else {
          toast.success('Payment verified.');
        }
        resetModal();
      } else {
        toast.error(data?.message || 'Unexpected response from server');
      }
    } catch (err) {
      console.error('handleVerify error', err);
      const msg = err?.response?.data?.message || 'Failed to verify payment';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (paymentId) => {
    if (!rejectionMessage.trim()) {
      toast.error('Please provide a clear rejection reason.');
      return;
    }
    setActionLoading(true);
    try {
      // Send status: 'rejected' (lowercase) for backend
      const body = { status: 'rejected', rejectionMessage };
      const res = await AdminAPI.verifyPayment(paymentId, body);
      const data = res.data;
      if (data && (data.status === 'success' || data.status === 'warning')) {
        updatePaymentStatusInList(paymentId, 'Rejected');
        setLastActionResult(data); // store backend response for result display
        setCurrentStep(4); // show result step
        const emailSent = data.email?.sent;
        if (emailSent) {
          toast.success(data.message || 'Payment rejected and user notified by email.');
        } else {
          toast.success(data.message || 'Payment rejected. Email sending failed — notify user manually.');
          if (data.email?.error) toast.error(`Email error: ${data.email.error}`);
        }
      } else {
        toast.error(data?.message || 'Unexpected response from server');
      }
    } catch (err) {
      console.error('handleReject error', err);
      const msg = err?.response?.data?.message || 'Failed to reject payment';
      toast.error(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const resetModal = () => {
    setSelectedPayment(null);
    setRejectionMessage('');
    setCurrentStep(1);
    setViewOnly(false);
    setLastActionResult(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
          <p className="text-gray-600 mt-2">Manage and verify team payments efficiently</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-blue-600">{payments.length}</div>
            <div className="text-gray-600">Total Payments</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter(p => p.status === 'Pending').length}
            </div>
            <div className="text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter(p => p.status === 'Verified').length}
            </div>
            <div className="text-gray-600">Verified</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-red-600">
              {payments.filter(p => p.status === 'Rejected').length}
            </div>
            <div className="text-gray-600">Rejected</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-600">{payment.name}</div>
                        <div className="text-xs text-gray-400 mt-1">{payment.referenceId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{payment.email}</div>
                        <div className="text-xs text-gray-500 mt-1">{payment.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleView(payment._id)}
                            disabled={actionLoading}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            👁️ View
                          </button>
                          <button
                            onClick={() => handleOpenReview(payment)}
                            disabled={actionLoading}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            ✏️ Review
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Payment Review</h3>
                <div>
                  <button onClick={resetModal} className="text-sm text-gray-500 hover:underline">Close</button>
                </div>
              </div>

              <div className="p-6">
                {/* Step 1 - View */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayment.status)}`}>
                            {selectedPayment.status}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedPayment.name}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedPayment.email}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Reference ID</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedPayment.referenceId}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                        <div className="mt-1 text-sm text-gray-900">{selectedPayment.transactionId}</div>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Screenshot</label>
                        <div className="mt-1">
                          {selectedPayment.screenshot ? (
                            <a href={selectedPayment.screenshot} target="_blank" rel="noreferrer" className="text-blue-600 underline">Open Screenshot</a>
                          ) : (
                            <span className="text-sm text-gray-500">No screenshot provided</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                      {!viewOnly && (
                        <button onClick={() => setCurrentStep(2)} className="px-4 py-2 bg-blue-600 text-white rounded-md">Next Step</button>
                      )}
                      <button onClick={resetModal} className="px-4 py-2 border rounded-md">Close</button>
                    </div>
                  </div>
                )}

                {/* Step 2 - Choose */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-800">Review Guidelines</h4>
                      <div className="text-sm text-blue-700 mt-2">
                        <p>• Verify payment details match the team information</p>
                        <p>• Check payment amount and transaction ID</p>
                        <p>• Provide a clear reason if rejecting</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button onClick={() => { setSelectedPayment(prev => ({ ...prev, action: 'approve' })); setCurrentStep(3); }} className="p-4 border rounded-lg text-left hover:bg-green-50">Approve Payment</button>
                      <button onClick={() => { setSelectedPayment(prev => ({ ...prev, action: 'reject' })); setCurrentStep(3); }} className="p-4 border rounded-lg text-left hover:bg-red-50">Reject Payment</button>
                    </div>

                    <div className="flex justify-between">
                      <button onClick={() => setCurrentStep(1)} className="px-4 py-2 border rounded-md">Back</button>
                      <button onClick={resetModal} className="px-4 py-2 border rounded-md">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Step 3 - Confirm */}
                {currentStep === 3 && (
                  <div>
                    {selectedPayment.action === 'reject' ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Rejection *</label>
                        <textarea className="w-full border p-3 rounded-md" rows={4} value={rejectionMessage} onChange={e => setRejectionMessage(e.target.value)} placeholder="Provide clear reason..." />
                        <div className="flex justify-end pt-4 space-x-3">
                          <button onClick={() => setCurrentStep(2)} className="px-4 py-2 border rounded-md">Back</button>
                          <button onClick={() => handleReject(selectedPayment._id)} disabled={actionLoading || !rejectionMessage.trim()} className="px-4 py-2 bg-red-600 text-white rounded-md">
                            {actionLoading ? 'Processing...' : 'Confirm Rejection'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">✓</div>
                        <h4 className="text-lg font-medium">Approve Payment?</h4>
                        <p className="text-gray-600 mt-1">Are you sure you want to verify and approve this payment?</p>
                        <div className="flex justify-center mt-4 space-x-3">
                          <button onClick={() => setCurrentStep(2)} className="px-4 py-2 border rounded-md">Back</button>
                          <button onClick={() => handleVerify(selectedPayment._id)} disabled={actionLoading} className="px-4 py-2 bg-green-600 text-white rounded-md">
                            {actionLoading ? 'Processing...' : 'Yes, Approve Payment'}
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
                      <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">✗</div>
                      <h4 className="text-lg font-medium text-red-700">Payment Rejected</h4>
                      <p className="text-gray-700 mt-2">{lastActionResult.message}</p>
                    </div>
                    <div className="bg-gray-50 border p-4 rounded-lg">
                      <div className="mb-2">
                        <span className="font-semibold">Rejection Reason:</span>
                        <span className="ml-2 text-gray-800">{
                          lastActionResult.payment?.rejectionReason ||
                          lastActionResult.payment?.rejectionMessage ||
                          'N/A'
                        }</span>
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Email Status:</span>
                        <span className={`ml-2 ${lastActionResult.email?.sent ? 'text-green-700' : 'text-red-700'}`}>
                          {lastActionResult.email?.sent ? 'Sent' : 'Failed'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold">Email To:</span>
                        <span className="ml-2 text-gray-800">{lastActionResult.email?.to}</span>
                      </div>
                      {lastActionResult.email?.error && (
                        <div className="mt-2 text-red-600 text-sm">
                          <span className="font-semibold">Email Error:</span> {lastActionResult.email.error}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-end pt-4">
                      <button onClick={resetModal} className="px-4 py-2 bg-gray-700 text-white rounded-md">Close</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentManager;
