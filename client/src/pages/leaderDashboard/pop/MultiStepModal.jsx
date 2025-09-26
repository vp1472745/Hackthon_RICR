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

  const StepComponent = stepComponents[step];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 p-6 relative">
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
        <StepComponent data={formData} onChange={handleChange} />
        <div className="mt-6 flex justify-between gap-2">
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${step === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-[#0B2A4A] hover:bg-gray-200'}`}
            onClick={handleBack}
            disabled={step === 0}
          >
            Back
          </button>
          {step < stepComponents.length - 1 ? (
            <button
              className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              onClick={handleSave}
            >
              Save
            </button>
          )}
        </div>
        <div className="absolute top-2 right-2">
          <button
            className="text-gray-400 hover:text-gray-700 text-xl font-bold"
            onClick={() => { setModalOpen(false); if (onClose) onClose(); }}
            disabled={step < stepComponents.length - 1}
            title={step < stepComponents.length - 1 ? 'Complete all steps to close' : 'Close'}
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepModal;
