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
  const [isStep2Saved, setIsStep2Saved] = useState(false);
  const [isStep3Saved, setIsStep3Saved] = useState(false);
  const [isStep4Saved, setIsStep4Saved] = useState(false);

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
    const userRole = hackathonUser?.user?.role;
    
    if (userRole !== 'Leader') {
      console.log('MultiStepModal blocked for non-leader user:', userRole);
      setModalOpen(false);
      if (onClose) onClose();
      return;
    }
    
    if (hackathonUser.termsAccepted) {
      setModalOpen(false);
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
      hackathonUser.termsAccepted = true;
      sessionStorage.setItem('hackathonUser', JSON.stringify(hackathonUser));
    }
  }, [modalOpen]);

  if (!modalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-2 sm:p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[85vh] overflow-y-auto mx-2 sm:mx-4 p-4 sm:p-6 md:p-8 relative">
        {/* Stepper - Responsive Design */}
        {/* <div className="flex flex-wrap items-center mt-12 justify-center mb-6 sm:mb-8 gap-2 sm:gap-4 md:gap-5">
          {steps.map((s, idx) => (
            <React.Fragment key={s.label}>
              <div className="flex flex-col items-center flex-1 min-w-[60px] sm:min-w-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 text-sm sm:text-lg font-bold transition-all duration-200
                    ${idx < step ? 'bg-green-500 text-white border-green-500' : idx === step ? 'bg-white text-black border-black' : 'bg-gray-100 text-gray-400 border-gray-300'}`}
                >
                  {s.label}
                </div>
                <span className={`mt-1 sm:mt-2 text-xs text-center font-medium ${idx < step ? 'text-green-500' : idx === step ? 'text-black' : 'text-gray-400'}`}>
                  
                  <span className="hidden sm:inline">{s.name}</span>
                  <span className="sm:hidden text-[10px] leading-tight">
                    {s.name.split(' ').map(word => word[0]).join('')}
                  </span>
                </span>
              </div>
              
             
              {idx < steps.length - 1 && (
                <div className="hidden xs:flex items-center flex-1 max-w-[40px] sm:max-w-[60px] md:max-w-[80px]">
                  <div className={`h-1 w-full mx-1 sm:mx-2 rounded bg-gradient-to-r ${idx < step ? 'from-green-500 to-green-400' : 'from-gray-300 to-gray-200'}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div> */}

        {/* Alternative Stepper for very small screens */}
        <div className="flex justify-center mb-4">
          <div className="bg-gray-100 rounded-full px-3 py-1">
            <span className="text-xs md:text-md font-medium text-gray-700">
              Step {step + 1} of {steps.length}: {steps[step].name}
            </span>
          </div>
        </div>

        {/* Step Content */}
        <div className="">
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
        </div>

        {/* Navigation hints for mobile */}
        <div className="md:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>
              {step > 0 && 'Swipe left for previous step'}
            </span>
            <span>
              {step < steps.length - 1 && 'Swipe right for next step'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiStepModal;