import React from 'react';
import { CheckCircle, User, Shield, CreditCard } from 'lucide-react';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Team Leader Details', icon: User },
    { id: 2, title: 'Verification', icon: Shield },
    { id: 3, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="mb-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Container with Fixed Width */}
              <div className="flex flex-col items-center w-1/3 text-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-4 transition-all duration-500 shadow-md ${
                    isCompleted
                      ? 'bg-gradient-to-r from-green-400 to-green-600 border-green-500 text-white'
                      : isCurrent
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 border-blue-500 text-white scale-110'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <span
                  className={`text-xs sm:text-sm mt-2 font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent ? 'text-blue-700 font-semibold' : 'text-gray-600'
                  }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-2 bg-gray-300 rounded-full relative mx-2 sm:mx-3 lg:mx-4">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                      currentStep > step.id
                        ? 'bg-gradient-to-r from-green-400 to-green-600 w-full'
                        : 'bg-gray-300 w-full'
                    }`}
                  ></div>
                </div>
              )}

              {/* Right Arrow - Ensure it remains unchanged */}
              {index < steps.length - 1 && (
                <div className="flex items-center mx-1 sm:mx-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-colors duration-500 ${
                      currentStep > step.id ? 'text-green-600' : 'text-gray-400'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;