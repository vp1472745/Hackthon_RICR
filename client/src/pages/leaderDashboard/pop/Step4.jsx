import React, { useState } from 'react';
import { userAPI } from '../../../configs/api';

const Step4 = ({ setIsStep4Saved, setIsNextDisabled }) => {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleAccept = async (e) => {
    const accepted = e.target.checked;
    setIsAccepted(accepted);
    setIsStep4Saved(accepted); // Notify MultiStepModal when terms are accepted
    setIsNextDisabled(!accepted); // Disable Next button if terms are not accepted

    if (accepted) {
      try {
        const response = await userAPI.updateTermsAccepted({ termsAccepted: true });
        console.log('Terms accepted updated:', response.data);
      } catch (error) {
        console.error('Error updating termsAccepted:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-6">
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h3>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <p className="text-gray-600 mb-4">
            Please read and accept the following terms and conditions to proceed:
          </p>
          <ul className="list-disc pl-6 text-gray-600 space-y-2">
            <li>Bring a valid ID proof on the day of the event.</li>
            <li>Ensure your team is present at the venue 30 minutes before the start time.</li>
            <li>Follow all the rules and guidelines provided by the organizers.</li>
            <li>Respect the decisions of the judges and organizers.</li>
            <li>Any form of misconduct will lead to disqualification.</li>
          </ul>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <input
            type="checkbox"
            id="acceptTerms"
            checked={isAccepted}
            onChange={handleAccept}
            className="w-5 h-5 text-[#0B2A4A] border-gray-300 rounded focus:ring-2 focus:ring-[#0B2A4A]"
          />
          <label htmlFor="acceptTerms" className="text-gray-800 font-medium">
            I have read and accept the terms and conditions.
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step4;
