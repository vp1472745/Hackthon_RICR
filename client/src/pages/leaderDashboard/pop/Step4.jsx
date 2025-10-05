import React, { useState } from 'react';
import { authAPI, userAPI } from '../../../configs/api';

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
 

        const refresh_response = await authAPI.refreshData();
        sessionStorage.setItem('hackathonUser', JSON.stringify({
          email: refresh_response.data.user.email,
          user: refresh_response.data.user,
          team: refresh_response.data.team,
          theme: refresh_response.data.theme,
          ProblemStatements: refresh_response.data.ProblemStatements,
          loginTime: sessionStorage.getItem('hackathonUser') ? JSON.parse(sessionStorage.getItem('hackathonUser')).loginTime : new Date().toISOString(),
        }));

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
