import React, { useState } from 'react';
import MultiStepModal from './MultiStepModal';

const OpenModalButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center mt-8 p-4 sm:p-6">
      <button
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700 transition-colors w-full max-w-xs sm:max-w-sm"
        onClick={() => setIsOpen(true)}
      >
        Open Multi-Step Modal
      </button>
      <MultiStepModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default OpenModalButton;
