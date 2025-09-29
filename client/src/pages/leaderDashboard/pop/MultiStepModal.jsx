import React, { useState, useEffect } from 'react';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';

const steps = [
  { label: '1', name: 'Leader Profile' },
  { label: '2', name: 'Add Team Member' },
  { label: '3', name: 'Select Theme' },
  { label: '✓', name: 'Terms & Conditions' }
];
const stepComponents = [Step1, Step2, Step3, Step4];

const MultiStepModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [modalOpen, setModalOpen] = useState(isOpen);
  const [isStep1Saved, setIsStep1Saved] = useState(false);

  const [isStep2Saved, setIsStep2Saved] = useState(false); // Track Step2 save status
  const [isStep3Saved, setIsStep3Saved] = useState(false); // Track Step3 save status
  const [isStep4Saved, setIsStep4Saved] = useState(false); // Track Step4 save status

  const StepComponent = stepComponents[step];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (step === 0 && !isStep1Saved) {
      console.error('Step 1 is not saved. Cannot proceed to Step 2.');
      return;
    }

    if (step < stepComponents.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  useEffect(() => {
    const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
    if (hackathonUser.termsAccepted) {
      setModalOpen(false); // Close the modal if terms are already accepted
      if (onClose) onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isStep4Saved) {
      setModalOpen(false);
      if (onClose) onClose();
    }
  }, [isStep4Saved, onClose]);

  useEffect(() => {
    if (!modalOpen) {
      const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
      hackathonUser.termsAccepted = true; // Update termsAccepted to true
      sessionStorage.setItem('hackathonUser', JSON.stringify(hackathonUser));
    }
  }, [modalOpen]);

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4 sm:p-6">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto mx-4 p-6 relative">
        {/* Stepper */}
        <div className="flex flex-wrap items-center justify-center mb-8 gap-5">
          {steps.map((s, idx) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-200
                    ${idx < step ? 'bg-green-500 text-white border-green-500' : idx === step ? 'bg-white text-black border-black' : 'bg-gray-100 text-gray-400 border-gray-300'}`}
                >
                  {s.label}
                </div>
                <span className={`mt-2 text-xs font-medium ${idx < step ? 'text-green-500' : idx === step ? 'text-black' : 'text-gray-400'}`}>{s.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex items-center">
                  <div className={`h-1 w-16 sm:w-20 mx-2 rounded bg-gradient-to-r ${idx < step ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        {/* Step Content */}
        <StepComponent
          data={formData}
          onChange={handleChange}
          setIsStep1Saved={setIsStep1Saved}
          setStep={setStep}
          setIsStep2Saved={setIsStep2Saved}
          setIsStep3Saved={setIsStep3Saved}
          setIsStep4Saved={setIsStep4Saved}
          handleNext={handleNext}
          handleBack={handleBack}
        />

        {/* Removed Back and Next buttons */}
      </div>
    </div>
  );
};

export default MultiStepModal;