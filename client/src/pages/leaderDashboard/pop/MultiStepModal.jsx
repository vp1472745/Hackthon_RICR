import React, { useState } from 'react';
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
  const [isNextDisabled, setIsNextDisabled] = useState(false); // New state to track Next button state
  const [isStep2Saved, setIsStep2Saved] = useState(false); // Track Step2 save status
  const [isStep3Saved, setIsStep3Saved] = useState(false); // Track Step3 save status
  const [isStep4Saved, setIsStep4Saved] = useState(false); // Track Step4 save status

  const StepComponent = stepComponents[step];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if ((step === 0 && !isStep1Saved) || (step === 2 && !isStep3Saved) || (step === 3 && !isStep4Saved) || isNextDisabled) return; // Prevent moving to the next step if conditions are not met
    if (step < stepComponents.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSave = () => {
    console.log('Collected Data:', formData);
    setModalOpen(false);
    if (onClose) onClose();
  };

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto mx-4 p-6 relative">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-8 gap-5">
          {steps.map((s, idx) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full border-2 text-lg font-bold transition-all duration-200
                    ${idx < step ? 'bg-[#0B2A4A] text-white border-[#0B2A4A]' : idx === step ? 'bg-white text-[#0B2A4A] border-[#0B2A4A]' : 'bg-gray-100 text-gray-400 border-gray-300'}`}
                >
                  {s.label}
                </div>
                <span className={`mt-2 text-xs font-medium ${idx <= step ? 'text-[#0B2A4A]' : 'text-gray-400'}`}>{s.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex items-center">
                  <div className={`h-1 w-20 mx-2 rounded bg-gradient-to-r ${idx < step ? 'from-[#0B2A4A] to-blue-400' : 'from-gray-300 to-gray-200'}`}></div>
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
          setIsStep2Saved={setIsStep2Saved} // Pass the setter to Step2
          setIsNextDisabled={setIsNextDisabled}
          setIsStep3Saved={setIsStep3Saved}
          setIsStep4Saved={setIsStep4Saved} // Pass the setter to Step4
        />
        <div className="mt-3 flex justify-between gap-2">
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${step === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-[#0B2A4A] hover:bg-gray-200'}`}
            onClick={handleBack}
            disabled={step === 0}
          >
            Back
          </button>
          {step < stepComponents.length - 1 ? (
            <button
              className={`px-5 py-2 rounded-lg font-semibold transition-colors ${(step === 0 && !isStep1Saved) || (step === 2 && !isStep3Saved) || (step === 3 && !isStep4Saved) || isNextDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              onClick={handleNext}
              disabled={(step === 0 && !isStep1Saved) || (step === 2 && !isStep3Saved) || (step === 3 && !isStep4Saved) || isNextDisabled} // Disable Next button if conditions are not met
            >
              Next
            </button>
          ) : (
            <button
              className={`px-5 py-2 rounded-lg font-semibold transition-colors ${!isStep4Saved ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
              onClick={handleSave}
              disabled={!isStep4Saved} // Disable Save button if terms are not accepted
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepModal;