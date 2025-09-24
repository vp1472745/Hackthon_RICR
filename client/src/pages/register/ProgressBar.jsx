import React from 'react';
import { CheckCircle, User, Shield, CreditCard } from 'lucide-react';

const ProgressBar = ({ currentStep }) => {
  const steps = [
    { id: 1, title: 'Team Leader Details', icon: User },
    { id: 2, title: 'Verification', icon: Shield },
    { id: 3, title: 'Payment', icon: CreditCard }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isActive = currentStep >= step.id;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-green-500 border-green-500 text-white transform scale-110' 
                    : isCurrent 
                      ? 'bg-[#0B2A4A] border-[#0B2A4A] text-white transform scale-110 shadow-lg'
                      : 'bg-gray-200 border-gray-300 text-gray-500'
                }`}>
                  {isCompleted ? <CheckCircle size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-xs mt-2 text-center font-medium transition-colors duration-300 ${
                  isActive ? 'text-[#0B2A4A] font-semibold' : 'text-gray-600'
                }`}>
                  {step.title}
                </span>
              </div>
              
              {/* Connecting Line with Animation */}
              {index < steps.length - 1 && (
                <div className="flex-1  relative">
                  {/* Background Line */}
                  <div className="h-2 w-full bg-gray-300 rounded-full relative overflow-hidden">
                    {/* Animated Progress Line */}
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-in-out ${
                        currentStep > step.id 
                          ? 'bg-green-500 w-full' 
                          : currentStep === step.id 
                            ? 'bg-[#0B2A4A] w-full animate-pulse' 
                            : 'bg-gray-300 w-0'
                      }`}
                      style={{
                        transform: currentStep > step.id ? 'translateX(0)' : 'translateX(-100%)',
                        transition: 'transform 0.8s ease-in-out, background-color 0.3s ease'
                      }}
                    />
                  </div>
                  
                  {/* Progress Indicator Dots */}
                  {currentStep === step.id && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
                      <div className="w-1 h-1 bg-white rounded-full animate-ping"></div>
                    </div>
                  )}
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