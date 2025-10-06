import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiX, FiShield, FiEye, FiUserCheck, FiCheckCircle } from 'react-icons/fi';

const ReconfirmModal = ({ showModal, setShowModal, onConfirm, title = "Critical Action Required", actionType = "delete" }) => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [checked3, setChecked3] = useState(false);
    const [countdown, setCountdown] = useState(5);
    const [canProceed, setCanProceed] = useState(false);

    const allChecked = checked1 && checked2 && checked3;

    // Reset states when modal opens/closes
    useEffect(() => {
        if (showModal) {
            setChecked1(false);
            setChecked2(false);
            setChecked3(false);
            setCountdown(5);
            setCanProceed(false);
        }
    }, [showModal]);

    // Countdown timer
    useEffect(() => {
        if (showModal && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanProceed(true);
        }
    }, [showModal, countdown]);

    const handleConfirm = () => {
        if (allChecked && canProceed) {
            onConfirm();
            setShowModal(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
    };

    // Dynamic styling based on action type
    const getActionStyle = () => {
        switch (actionType) {
            case 'delete':
                return {
                    headerBg: 'bg-gradient-to-r from-red-500 to-red-600',
                    iconColor: 'text-red-500',
                    buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-600'
                };
            case 'update':
                return {
                    headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
                    iconColor: 'text-orange-500',
                    buttonBg: 'bg-orange-600 hover:bg-orange-700 focus:ring-orange-500',
                    borderColor: 'border-orange-200',
                    textColor: 'text-orange-600'
                };
            default:
                return {
                    headerBg: 'bg-gradient-to-r from-red-500 to-red-600',
                    iconColor: 'text-red-500',
                    buttonBg: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-600'
                };
        }
    };

    const styles = getActionStyle();

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className={`${styles.headerBg} text-white p-6 rounded-t-2xl relative`}>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-full">
                            <FiAlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{title}</h2>
                            <p className="text-white/90 text-sm">Security confirmation required</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Warning Message */}
                    <div className={`${styles.borderColor} border-l-4 bg-gray-50 p-4 rounded-r-lg mb-6`}>
                        <div className="flex items-start gap-3">
                            <FiShield className={`${styles.iconColor} w-5 h-5 mt-0.5 flex-shrink-0`} />
                            <div>
                                <p className="text-gray-800 font-medium mb-2">
                                    This action is <span className={`font-bold ${styles.textColor}`}>irreversible</span>
                                </p>
                                <p className="text-gray-600 text-sm">
                                    Once you proceed, you will not be able to undo this change. Please ensure you have reviewed all information carefully before continuing.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Countdown Timer */}
                    {countdown > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                    <span className="text-yellow-600 font-bold text-sm">{countdown}</span>
                                </div>
                                <p className="text-yellow-800 text-sm">
                                    Please wait {countdown} seconds before you can proceed
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Confirmation Checkboxes */}
                    <div className="space-y-4 mb-6">
                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${!canProceed
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                : checked1
                                    ? 'border-green-200 bg-green-50 cursor-pointer'
                                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                            }`}>
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={checked1}
                                    onChange={(e) => canProceed && setChecked1(e.target.checked)}
                                    disabled={!canProceed}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${!canProceed
                                        ? 'border-gray-300 bg-gray-100'
                                        : checked1
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-gray-300'
                                    }`}>
                                    {checked1 && canProceed && <FiCheckCircle className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiShield className={`w-4 h-4 mt-0.5 flex-shrink-0 ${!canProceed ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${!canProceed
                                        ? 'text-gray-400'
                                        : checked1
                                            ? 'text-green-700'
                                            : 'text-gray-700'
                                    }`}>
                                    I understand this action cannot be undone
                                </span>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${!canProceed
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                : checked2
                                    ? 'border-green-200 bg-green-50 cursor-pointer'
                                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                            }`}>
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={checked2}
                                    onChange={(e) => canProceed && setChecked2(e.target.checked)}
                                    disabled={!canProceed}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${!canProceed
                                        ? 'border-gray-300 bg-gray-100'
                                        : checked2
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-gray-300'
                                    }`}>
                                    {checked2 && canProceed && <FiCheckCircle className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiEye className={`w-4 h-4 mt-0.5 flex-shrink-0 ${!canProceed ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${!canProceed
                                        ? 'text-gray-400'
                                        : checked2
                                            ? 'text-green-700'
                                            : 'text-gray-700'
                                    }`}>
                                    I have reviewed all information carefully
                                </span>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-colors ${!canProceed
                                ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                                : checked3
                                    ? 'border-green-200 bg-green-50 cursor-pointer'
                                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                            }`}>
                            <div className="relative mt-0.5">
                                <input
                                    type="checkbox"
                                    checked={checked3}
                                    onChange={(e) => canProceed && setChecked3(e.target.checked)}
                                    disabled={!canProceed}
                                    className="sr-only"
                                />
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${!canProceed
                                        ? 'border-gray-300 bg-gray-100'
                                        : checked3
                                            ? 'border-green-500 bg-green-500'
                                            : 'border-gray-300'
                                    }`}>
                                    {checked3 && canProceed && <FiCheckCircle className="w-3 h-3 text-white" />}
                                </div>
                            </div>
                            <div className="flex items-start gap-2">
                                <FiUserCheck className={`w-4 h-4 mt-0.5 flex-shrink-0 ${!canProceed ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span className={`text-sm ${!canProceed
                                        ? 'text-gray-400'
                                        : checked3
                                            ? 'text-green-700'
                                            : 'text-gray-700'
                                    }`}>
                                    I accept full responsibility for this action
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleCancel}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={!allChecked || !canProceed}
                            className={`flex-1 px-4 py-3 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${allChecked && canProceed
                                    ? `${styles.buttonBg} transform hover:scale-105`
                                    : 'bg-gray-300 cursor-not-allowed'
                                }`}
                        >
                            {!canProceed ? `Wait ${countdown}s` : allChecked ? 'Confirm Action' : 'Check all items'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ReconfirmModal   