import React, { useState } from 'react';
import { userAPI } from '../../../configs/api';

const Step4 = ({ setIsStep4Saved }) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const handleAccept = (e) => {
    const accepted = e.target.checked;
    setIsAccepted(accepted);
    setIsStep4Saved(false); // Do not mark Step 4 as saved yet
    setIsNextDisabled(!accepted); // Disable Next button if terms are not accepted
  };

  const handleSave = async () => {
    if (isAccepted) {
      try {
        const response = await userAPI.updateTermsAccepted({ termsAccepted: true });
        console.log('Terms accepted updated:', response.data);
        const hackathonUser = JSON.parse(sessionStorage.getItem('hackathonUser') || '{}');
        hackathonUser.user.termsAccepted = true; // Update termsAccepted to true
        sessionStorage.setItem('hackathonUser', JSON.stringify(hackathonUser));
        setIsStep4Saved(true); // Notify MultiStepModal that Step 4 is saved
      } catch (error) {
        console.error('Error updating termsAccepted:', error);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-lg p-6">
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Terms and Conditions</h3>
        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl shadow-lg">
          {/* Terms and Conditions Section */}
          <div className="space-y-4">
            <p className="text-sm text-gray-700">Please read and accept the terms and conditions:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Bring a valid ID proof on the day of the event.</li>
              <li>Ensure your team is present at the venue 30 minutes before the start time.</li>
              <li>Follow all the rules and guidelines provided by the organizers.</li>
            </ul>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={handleAccept}
                className="rounded border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-gray-700">I accept the terms and conditions</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${isAccepted ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            onClick={handleSave}
            disabled={!isAccepted}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Step4;
